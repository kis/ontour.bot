const bot = require('../../instances/bot');
const { constants } = require('../../constants/constants');
const { log } = require('../../config/logger');
const { getLanguage, setLanguage } = require('../../lang/instance');

console.log('123123');

bot.onText(/\/start/, async msg => {
    await log(msg, constants.EVENT_STARTED);
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constants.REPLY_OPTIONS);
});