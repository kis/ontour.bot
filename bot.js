const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const request = require('superagent');
const token = process.env.TOKEN;
const API_KEY = 'iOAsnWYdLjjhNvvM';

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
    bot.sendMessage(msg.chat.id, "Welcome. To search concerts type /search");
});

bot.onText(/\/help/, (msg) => {
    let message = `
Commands:
/start
/locations
/artists
/help
    `;

    bot.sendMessage(msg.chat.id, message, {
        "parse_mode": "html"
    });
});

bot.onText(/\/search/, (msg) => {
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
        
        bot.sendMessage(msg.chat.id, `Found ${eventsCount} concerts, I will group it 5 per message, please continue with tap on Next`);

        if (!eventsList.event || !eventsList.event.length) return;

        let eventTpl = '';

        eventsList.event.map(event => {
            let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
		    let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
		    if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

            eventTpl += `
<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}
            `;
        });

        bot.sendMessage(msg.chat.id, eventTpl, {
            "parse_mode": "html"
        });
    });
});

async function getArtist(artist_name) {
    return request
        .get('http://api.songkick.com/api/3.0/search/artists.json')
        .query({ apikey: API_KEY, query: artist_name, per_page: 1 });
}

async function getEventsByArtist(artist) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ apikey: API_KEY, per_page: 5 });
}

bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId, resp);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
});

module.exports = bot;