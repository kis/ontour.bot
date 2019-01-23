const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN, HEROKU_URL } = require('../config/config');

let bot;

if (process.env.NODE_ENV === 'production') {
//     bot = new TelegramBot(TELEGRAM_TOKEN);
//     bot.setWebHook(HEROKU_URL + bot.token);
// } else {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
}

module.exports = bot;