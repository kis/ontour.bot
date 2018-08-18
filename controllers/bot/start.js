const bot = require('../../instances/bot');
const { constants } = require('../../constants/constants');
const constantsEvents = require('../../constants/constants-events');
const { log } = require('../../config/logger');
const { getLanguage, setLanguage } = require('../../lang/instance');

bot.onText(/\/start/, async msg => {
    await log(msg, constantsEvents.EVENT_STARTED);
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constants.REPLY_OPTIONS);
});