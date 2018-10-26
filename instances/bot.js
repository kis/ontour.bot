const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_TOKEN, HEROKU_URL } = require('../config/config');

let bot;

const options = {
    webHook: {
      // Port to which you should bind is assigned to $PORT variable
      // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
      port: process.env.PORT
      // you do NOT need to set up certificates since Heroku provides
      // the SSL certs already (https://<app-name>.herokuapp.com)
      // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};

const url = process.env.APP_URL || `${HEROKU_URL}:443`;

if (process.env.NODE_ENV === 'production') {
    console.log('telegram', TELEGRAM_TOKEN)
    bot = new TelegramBot(TELEGRAM_TOKEN, options);
    bot.setWebHook(`${HEROKU_URL}/bot${TELEGRAM_TOKEN}`);
    console.log('webhook setted', `${HEROKU_URL}/${TELEGRAM_TOKEN}`);
} else {
    bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
}

bot.on('message', function onMessage(msg) {
    bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
});

module.exports = bot;