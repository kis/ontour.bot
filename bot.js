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

if(process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.WELCOME);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.COMMANDS, { "parse_mode": "html" });
});

bot.onText(/\/artists/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.BAND);
    searchType = constants.ARTISTS_SEARCH;
    searchPage = 0;

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, lang.BAND_SEARCH(reply.text));
        let artists = await getArtists(reply.text);

        if (!artists || !artists.resultsPage.results.artist) {
            bot.sendMessage(msg.chat.id, lang.BAND_NOT_FOUND);
            return;
        }

        let artist = artists.resultsPage.results.artist[0];
        artistSearchParams = {
            artist: artist,
            chatID: msg.chat.id
        };
        await getNextEventsByArtist();
    });
});

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
    sendEventsList(chatID, eventTpl);
}

bot.onText(/\/locations/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.LOCATION);
    searchType = constants.LOCATIONS_SEARCH;
    searchPage = 0;

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, lang.LOCATION_SEARCH(reply.text));
        let cities = await getMetroAreas(reply.text);

        if (!cities || !cities.resultsPage.results.location) {
            bot.sendMessage(msg.chat.id, lang.LOCATION_NOT_FOUND);
            return;
        }

        let location = cities.resultsPage.results.location[0];
        let city = location.city;
        let metroAreaID = location.metroArea.id;
        locationSearchParams = {
            metroAreaID: metroAreaID,
            city: city,
            chatID: msg.chat.id
        };
        await getNextEventsByMetroAreaID();
    });
});

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
    sendEventsList(chatID, eventTpl);
}

function sendEventsList(chatID, message) {
    bot.sendMessage(chatID, message, { 
        "parse_mode": "html",
        "reply_markup": JSON.stringify({
            "keyboard": [
                [{text: lang.NEXT}]
            ]
        }) 
    });
}

bot.onText(/\/setlang/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, lang.SET_LANG, { 
        "parse_mode": "html",
        "reply_markup": JSON.stringify({
            "keyboard": [
                [{text: `🇺🇸 ${constants.LANG_EN}`}],
                [{text: `🇷🇺 ${constants.LANG_RU}`}]
            ]
        }) 
    });

    bot.once("message", (reply) => {
        bot.sendMessage(msg.chat.id, lang.LANG_IS(reply.text));
        
        if (reply.text.indexOf(constants.LANG_EN) != -1) {
            lang = langEn;
        } else if (reply.text.indexOf(constants.LANG_RU) != -1) {
            lang = langRu;
        }
    });
});

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