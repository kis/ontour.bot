const TelegramBot = require('node-telegram-bot-api');
const { token, herokuUrl } = require('../config/telegram');

let bot;

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(herokuUrl + bot.token);
} else {
    bot = new TelegramBot(token, { polling: true });
}

module.exports = bot;