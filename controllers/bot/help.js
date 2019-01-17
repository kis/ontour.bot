const bot = require('../../instances/bot');
const constantsReply = require('../../constants/constants-reply');
const { getLanguage, setLanguage } = require('../../lang/instance');

const { log } = require('../../config/logger');
const constantsEvents = require('../../constants/constants-events');

bot.onText(/\/help/, (msg) => {
    await log(msg, constantsEvents.EVENT_HELP, 'Help');
    bot.sendMessage(msg.chat.id, getLanguage().COMMANDS, constantsReply.REPLY_OPTIONS);
});