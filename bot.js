const { getArtist, getEventsByArtist, getLocation, getEventsByMetroAreaID } = require('./api');
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const token = process.env.TOKEN;

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

        console.log(artist)

        let ontourUntil = moment(artist.onTourUntil).format('MMM D, YYYY');
        let eventTpl = `<b>${artist.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;

        eventsList.event.map(event => {
            let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
		    let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
		    if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

            eventTpl += `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
        });

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

        let country = citiesParsed.resultsPage.results.location[0].city.country.displayName;
        let city = citiesParsed.resultsPage.results.location[0].city.displayName;
        let metroAreaID = citiesParsed.resultsPage.results.location[0].metroArea.id;
        let events = await getEventsByMetroAreaID(metroAreaID);
        let eventsParsed = JSON.parse(events.text);
        let eventsList = eventsParsed.resultsPage.results;
        let eventsCount = eventsParsed.resultsPage.totalEntries;
        
        let message = !eventsCount ?
            `Found ${eventsCount} concerts, sorry :(` :
            `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`;

        bot.sendMessage(msg.chat.id, message);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = `<b>${city.toUpperCase()} ${country.toUpperCase()} CONCERTS</b>\n\n`;

        eventsList.event.map(event => {
            let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
		    let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
		    if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

            eventTpl += `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
        });

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