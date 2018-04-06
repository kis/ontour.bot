const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { constants } = require('./constants');
const { langEn } = require('./lang/lang-en');
const { langRu } = require('./lang/lang-ru');

let lang = langEn;

const { 
    getEventsListTemplate, 
    getArtists, 
    getEventsByArtist, 
    getMetroAreas,
    getEventsByMetroAreaID 
} = require('./utils');

let bot;
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
    bot.sendMessage(msg.chat.id, lang.WELCOME(msg.from.first_name));
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.COMMANDS, { "parse_mode": "html" });
});

bot.onText(/\/artists/, async msg => {
    bot.sendMessage(msg.chat.id, lang.BAND);
    searchType = constants.ARTISTS_SEARCH;
    searchPage = 0;

    let artists = await getArtist(msg.chat.id);
    let date = await getFromDate(msg.chat.id);
    let events = await getArtistEvents(artists, msg.chat.id);
});

async function getArtist(chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let artists = await getArtists(reply.text);
    
            if (!artists || !artists.resultsPage.results.artist) {
                bot.sendMessage(chatId, lang.BAND_NOT_FOUND);
                return;
            }
    
            sendMessageWithNext(chatId, lang.DATES_FROM);
            resolve(artists);
        });
    });
}

async function getFromDate(chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            sendMessageWithNext(chatId, lang.DATES_TO);
            resolve(true);
        });
    });
}

async function getArtistEvents(artists, chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let artist = artists.resultsPage.results.artist[0];
            bot.sendMessage(chatId, lang.BAND_SEARCH(artist.displayName));
            artistSearchParams = {
                artist: artist,
                chatID: chatId
            };
            await getNextEventsByArtist();
            resolve(true);
        });
    });
}

async function getNextEventsByArtist() {
    let { artist, chatID } = artistSearchParams;
    searchPage++;

    let { eventsList, eventsCount } = await getEventsByArtist(artist, searchPage);
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, artist, constants.ARTISTS_SEARCH);
    if (searchPage * constants.EVENTS_PER_PAGE > eventsCount) {
        artistSearchParams = null;
        eventTpl += lang.FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

bot.onText(/\/locations/, async msg => {
    bot.sendMessage(msg.chat.id, lang.LOCATION);
    searchType = constants.LOCATIONS_SEARCH;
    searchPage = 0;

    let cities = await getLocation(msg.chat.id);
    let date = await getFromDate(msg.chat.id);
    let events = await getCityEvents(cities, msg.chat.id);
});

async function getLocation(chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let cities = await getMetroAreas(reply.text);
    
            if (!cities || !cities.resultsPage.results.location) {
                bot.sendMessage(chatId, lang.LOCATION_NOT_FOUND);
                return;
            }

            sendMessageWithNext(chatId, lang.DATES_FROM);
            resolve(cities);
        });
    });
}

async function getCityEvents(cities, chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            let location = cities.resultsPage.results.location[0];
            let city = location.city;
            let metroAreaID = location.metroArea.id;
            bot.sendMessage(chatId, lang.LOCATION_SEARCH(city.displayName));
            locationSearchParams = {
                metroAreaID: metroAreaID,
                city: city,
                chatID: chatId
            };
            await getNextEventsByMetroAreaID();
            resolve(true);
        });
    });
}

async function getNextEventsByMetroAreaID() {
    let { metroAreaID, city, chatID } = locationSearchParams;
    searchPage++;

    let { eventsList, eventsCount } = await getEventsByMetroAreaID(metroAreaID, searchPage);
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, city, constants.LOCATIONS_SEARCH);
    if (searchPage * constants.EVENTS_PER_PAGE > eventsCount) {
        locationSearchParams = null;
        eventTpl += lang.FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

function sendMessageWithNext(chatID, message) {
    bot.sendMessage(chatID, message, { 
        "parse_mode": "html",
        "reply_markup": JSON.stringify({
            "keyboard": [
                [{text: lang.NEXT}],
            ],
            "one_time_keyboard": true
        }) 
    });
}

bot.onText(/\/setlang/, async msg => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, lang.SET_LANG, { 
        "parse_mode": "html",
        "reply_markup": JSON.stringify({
            "keyboard": [
                [{text: `🇺🇸 ${constants.LANG_EN}`}],
                [{text: `🇷🇺 ${constants.LANG_RU}`}]
            ],
            "one_time_keyboard": true
        }) 
    });

    await setLanguage(msg.chat.id);
});

async function setLanguage(chatId) {
    return await new Promise((resolve, reject) => {
        bot.once("message", (reply) => {
            bot.sendMessage(chatId, lang.LANG_IS(reply.text));
            
            if (reply.text.indexOf(constants.LANG_EN) != -1) {
                lang = langEn;
            } else if (reply.text.indexOf(constants.LANG_RU) != -1) {
                lang = langRu;
            }

            resolve(true);
        });
    });
}

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
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