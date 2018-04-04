const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { ARTISTS_SEARCH, LOCATIONS_SEARCH } = require('./constants');
const { lang } = require('./lang/lang-en');

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
    searchType = ARTISTS_SEARCH;
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

    let events = await getEventsByArtist(artist, searchPage);
    if (events === lang.FINISHED) {
        bot.sendMessage(chatID, events);  
        return;
    }

    let { eventsList, eventsCount } = events;
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, artist, ARTISTS_SEARCH);
    sendEventsList(chatID, eventTpl);
}

bot.onText(/\/locations/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.LOCATION);
    searchType = LOCATIONS_SEARCH;
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

    let events = await getEventsByMetroAreaID(metroAreaID, searchPage);
    if (events === lang.FINISHED) {
        bot.sendMessage(chatID, events);
        return;
    }

    let { eventsList, eventsCount } = events;
    let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, city, LOCATIONS_SEARCH);
    sendEventsList(chatID, eventTpl);
}

function sendEventsList(chatID, message) {
    bot.sendMessage(chatID, message, { 
        "parse_mode": "html",
        "reply_markup": JSON.stringify({
            "keyboard": [
                [{text: 'Next'}],
            ]
        }) 
    });
}

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.on('message', async msg => {
    const chatId = msg.chat.id;

    if (msg.text === 'Next') {
        if (artistSearchParams && searchType === ARTISTS_SEARCH) {
            await getNextEventsByArtist();
        } else if (locationSearchParams && searchType === LOCATIONS_SEARCH) { 
            await getNextEventsByMetroAreaID();
        }
    }
});

module.exports = bot;