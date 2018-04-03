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
}
else {
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
    bot.sendMessage(msg.chat.id, "Cool, now type the name of the band");

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, `Let's search for ${reply.text}'s tour...`);
        let artists = await getArtists(reply.text);

        if (!artists || !artists.resultsPage.results.artist) {
            bot.sendMessage(msg.chat.id, 'Sorry, I haven\'t found such artist :(');
            return;
        }

        let artist = artists.resultsPage.results.artist[0];
        let { eventsList, eventsCount } = await getEventsByArtist(artist);

        let message = !eventsCount ?
            `Found ${eventsCount} concerts, sorry :(` :
            `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`;

        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = renderEventsList(eventsList, artist, ARTISTS_SEARCH);
        bot.sendMessage(msg.chat.id, eventTpl, { "parse_mode": "html" });
    });
});

bot.onText(/\/locations/, (msg) => {
    bot.sendMessage(msg.chat.id, "Cool, now type the city");

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, `Let's search for events in ${reply.text}...`);
        let cities = await getMetroAreas(reply.text);

        if (!cities || !cities.resultsPage.results.location) {
            bot.sendMessage(msg.chat.id, 'Sorry, I haven\'t found such city :(');
            return;
        }

        let location = cities.resultsPage.results.location[0];
        let city = location.city;
        let metroAreaID = location.metroArea.id;
        let { eventsList, eventsCount } = await getEventsByMetroAreaID(metroAreaID);
        
        let message = !eventsCount ?
            `Found ${eventsCount} concerts, sorry :(` :
            `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`;

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