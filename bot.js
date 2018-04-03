const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { ARTISTS_SEARCH, LOCATIONS_SEARCH } = require('./constants');
const { lang } = require('./lang/lang-en');

const { 
    renderEventsList, 
    getArtists, 
    getEventsByArtist, 
    getMetroAreas,
    getEventsByMetroAreaID 
} = require('./utils');

let bot;

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

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, lang.BAND_SEARCH(reply.text));
        let artists = await getArtists(reply.text);

        if (!artists || !artists.resultsPage.results.artist) {
            bot.sendMessage(msg.chat.id, lang.BAND_NOT_FOUND);
            return;
        }

        let artist = artists.resultsPage.results.artist[0];
        let { eventsList, eventsCount } = await getEventsByArtist(artist);

        let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = renderEventsList(eventsList, artist, ARTISTS_SEARCH);
        bot.sendMessage(msg.chat.id, eventTpl, { "parse_mode": "html" });
    });
});

bot.onText(/\/locations/, (msg) => {
    bot.sendMessage(msg.chat.id, lang.LOCATION);

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
        let { eventsList, eventsCount } = await getEventsByMetroAreaID(metroAreaID);
        
        let message = !eventsCount ? lang.EVENTS_NOT_FOUND : lang.EVENTS_FOUND(eventsCount);
        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = renderEventsList(eventsList, city, LOCATIONS_SEARCH);
        bot.sendMessage(msg.chat.id, eventTpl, { "parse_mode": "html" });
    });
});

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
});

module.exports = bot;