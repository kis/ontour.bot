const bot = require('../../instances/bot');
const constantsReply = require('../../constants/constants-reply');
const { getLanguage, setLanguage } = require('../../lang/instance');

const { log } = require('../../config/logger');
const constantsEvents = require('../../constants/constants-events');

bot.onText(/\/start/, async msg => {
    await log(msg, constantsEvents.EVENT_STARTED, 'Start');
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constantsReply.REPLY_OPTIONS);
});