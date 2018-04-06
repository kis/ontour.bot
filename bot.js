const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { constants } = require('./constants');
const { langEn } = require('./lang/lang-en');
const { langRu } = require('./lang/lang-ru');

const { 
    getEventsListTemplate, 
    getArtists, 
    getEventsByArtist, 
    getMetroAreas,
    getEventsByMetroAreaID 
} = require('./utils');

let bot;
let lang = langEn;
let searchType = null;
let searchPage = 0;
let artistSearchParams = null;
let locationSearchParams = null;

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.WELCOME(msg.from.first_name), constants.REPLY_OPTIONS);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.COMMANDS, constants.REPLY_OPTIONS);
});

bot.onText(/\/artists/, async msg => {
    searchType = constants.ARTISTS_SEARCH;
    searchPage = 0;

    let artists  = await askArtist(msg.chat.id);
    let fromDate = await askFromDate(msg.chat.id);
    let toDate   = await askToDate(msg.chat.id);
    try {
        setArtistSearchParams(artists, fromDate, toDate, msg.chat.id);
        await getNextEventsByArtist();
    } catch(e) {
        bot.sendMessage(msg.chat.id, lang.BAND_NOT_FOUND, constants.REPLY_OPTIONS);
    }
});

async function askArtist(chatId) {
    bot.sendMessage(chatId, lang.BAND, constants.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let artists = await getArtists(reply.text);
            resolve(artists);
        });
    });
}

async function askFromDate(chatId) {
    sendMessageWithNext(chatId, lang.DATES_FROM);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            resolve(reply.text);
        });
    });
}

async function askToDate(chatId) {
    sendMessageWithNext(chatId, lang.DATES_TO);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            resolve(reply.text);
        });
    });
}

function setArtistSearchParams(artists, fromDate, toDate, chatID) {
    let artist = artists.resultsPage.results.artist[0];
    bot.sendMessage(chatID, lang.BAND_SEARCH(artist.displayName), constants.REPLY_OPTIONS);
    artistSearchParams = {
        artist,
        fromDate,
        toDate,
        chatID
    };
}

async function getNextEventsByArtist() {
    let { artist, fromDate, toDate, chatID } = artistSearchParams;
    searchPage++;

    let { eventsList, eventsCount } = await getEventsByArtist(artist, fromDate, toDate, searchPage);
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constants.REPLY_OPTIONS);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, artist, constants.ARTISTS_SEARCH);
    if (searchPage * constants.EVENTS_PER_PAGE > eventsCount) {
        artistSearchParams = null;
        eventTpl += lang.FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

bot.onText(/\/locations/, async msg => {
    searchType = constants.LOCATIONS_SEARCH;
    searchPage = 0;

    let cities   = await askLocation(msg.chat.id);
    let fromDate = await askFromDate(msg.chat.id);
    let toDate   = await askToDate(msg.chat.id);
    try {
        setCitySearchParams(cities, fromDate, toDate, msg.chat.id);
        await getNextEventsByMetroAreaID();
    } catch(e) {
        bot.sendMessage(msg.chat.id, lang.LOCATION_NOT_FOUND, constants.REPLY_OPTIONS);
    }
});

async function askLocation(chatId) {
    bot.sendMessage(chatId, lang.LOCATION, constants.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let cities = await getMetroAreas(reply.text);
            resolve(cities);
        });
    });
}

function setCitySearchParams(cities, fromDate, toDate, chatID) {
    let location = cities.resultsPage.results.location[0];
    let city = location.city;
    let metroAreaID = location.metroArea.id;
    bot.sendMessage(chatID, lang.LOCATION_SEARCH(city.displayName), constants.REPLY_OPTIONS);
    locationSearchParams = {
        metroAreaID,
        city,
        fromDate,
        toDate,
        chatID
    };
}

async function getNextEventsByMetroAreaID() {
    let { metroAreaID, city, fromDate, toDate, chatID } = locationSearchParams;
    searchPage++;

    let { eventsList, eventsCount } = await getEventsByMetroAreaID(metroAreaID, fromDate, toDate, searchPage);
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constants.REPLY_OPTIONS);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, city, constants.LOCATIONS_SEARCH);
    if (searchPage * constants.EVENTS_PER_PAGE > eventsCount) {
        locationSearchParams = null;
        eventTpl += lang.FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

function sendMessageWithNext(chatID, message) {
    bot.sendMessage(chatID, message, constants.KEYBOARD_NEXT_OPTIONS(lang));
}

bot.onText(/\/setlang/, async msg => {
    const chatId = msg.chat.id;
    await askLanguage(chatId);
});

async function askLanguage(chatId) {
    bot.sendMessage(chatId, lang.SET_LANG, constants.KEYBOARD_LANGUAGE_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", (reply) => {
            if (reply.text.indexOf(constants.LANG_EN) != -1) {
                lang = langEn;
            } else if (reply.text.indexOf(constants.LANG_RU) != -1) {
                lang = langRu;
            }
            bot.sendMessage(chatId, lang.LANG_IS(reply.text), constants.REPLY_OPTIONS);
            resolve(true);
        });
    });
}

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp, constants.REPLY_OPTIONS);
});

bot.on('message', async msg => {
    const chatId = msg.chat.id;

    if (msg.text === lang.NEXT) {
        if (artistSearchParams && searchType === constants.ARTISTS_SEARCH) {
            await getNextEventsByArtist();
        } else if (locationSearchParams && searchType === constants.LOCATIONS_SEARCH) { 
            await getNextEventsByMetroAreaID();
        }
    }
});

module.exports = bot;