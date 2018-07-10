const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const { constants } = require('./constants');

const { getLanguage, setLanguage } = require('./lang/instance');

const {
    getSearchType,
    getArtistSearchParams,
    getLocationSearchParams
} = require('./bot/params');

let bot;

if (process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new TelegramBot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constants.REPLY_OPTIONS);
});

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, getLanguage().COMMANDS, constants.REPLY_OPTIONS);
});

bot.onText(/\/setlang/, async msg => {
    const chatId = msg.chat.id;
    await askLanguage(chatId);
});

async function askLanguage(chatId) {
    bot.sendMessage(chatId, getLanguage().SET_LANG, constants.KEYBOARD_LANGUAGE_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", (reply) => {
            if (reply.text.indexOf(constants.LANG_EN) != -1) {
                setLanguage(constants.LANG_EN);
            } else if (reply.text.indexOf(constants.LANG_RU) != -1) {
                setLanguage(constants.LANG_RU);
            } else if (reply.text.indexOf(constants.LANG_FR) != -1) {
                setLanguage(constants.LANG_FR);
            }
            bot.sendMessage(chatId, getLanguage().LANG_IS(reply.text), constants.REPLY_OPTIONS);
            resolve(true);
        });
    });
}

module.exports = bot;