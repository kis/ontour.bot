const { getArtist, getEventsByArtist, getLocation, getEventsByMetroAreaID } = require('./api');
const { renderEventsList } = require('./utils');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { ARTISTS_SEARCH, LOCATIONS_SEARCH } = require('./constants');

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
    bot.sendMessage(msg.chat.id, "Welcome. To search concerts by artists type /artists. To search events in different cities type /locations.");
});

bot.onText(/\/help/, (msg) => {
    let message = `
Commands:
/start
/artists - search concerts by artists and bands
/locations - search events in different cities
/help
    `;

    bot.sendMessage(msg.chat.id, message, {
        "parse_mode": "html"
    });
});

bot.onText(/\/artists/, (msg) => {
    bot.sendMessage(msg.chat.id, "Cool, now type the name of the band");

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, `Let's search for ${reply.text}'s tour...`);

        let artists = await getArtist(reply.text);
        let artistsParsed = JSON.parse(artists.text);

        if (!artistsParsed || !artistsParsed.resultsPage.results.artist) {
            bot.sendMessage(msg.chat.id, 'Sorry, I haven\'t found such artist :(');
            return;
        }

        let artist = artistsParsed.resultsPage.results.artist[0];
        let events = await getEventsByArtist(artist);
        let eventsParsed = JSON.parse(events.text);
        let eventsList = eventsParsed.resultsPage.results;
        let eventsCount = eventsParsed.resultsPage.totalEntries;
        
        let message = !eventsCount ?
            `Found ${eventsCount} concerts, sorry :(` :
            `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`;

        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = renderEventsList(eventsList, artist, ARTISTS_SEARCH);

        bot.sendMessage(msg.chat.id, eventTpl, {
            "parse_mode": "html"
        });
    });
});

bot.onText(/\/locations/, (msg) => {
    bot.sendMessage(msg.chat.id, "Cool, now type the city");

    bot.once("message", async reply => {
        bot.sendMessage(msg.chat.id, `Let's search for events in ${reply.text}...`);

        let cities = await getLocation(reply.text);
        let citiesParsed = JSON.parse(cities.text);

        if (!citiesParsed || !citiesParsed.resultsPage.results.location) {
            bot.sendMessage(msg.chat.id, 'Sorry, I haven\'t found such city :(');
            return;
        }

        let location = citiesParsed.resultsPage.results.location[0];

        let country = location.city.country.displayName;
        let city = location.city.displayName;
        let metroAreaID = location.metroArea.id;
        let events = await getEventsByMetroAreaID(metroAreaID);
        let eventsParsed = JSON.parse(events.text);
        let eventsList = eventsParsed.resultsPage.results;
        let eventsCount = eventsParsed.resultsPage.totalEntries;
        
        let message = !eventsCount ?
            `Found ${eventsCount} concerts, sorry :(` :
            `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`;

        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = renderEventsList(eventsList, {city, country}, LOCATIONS_SEARCH);

        bot.sendMessage(msg.chat.id, eventTpl, {
            "parse_mode": "html"
        });
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