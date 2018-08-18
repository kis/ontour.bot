const bot = require('../../instances/bot');
const constantsReply = require('../../constants/constants-reply');
const { getLanguage, setLanguage } = require('../../lang/instance');

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, getLanguage().COMMANDS, constantsReply.REPLY_OPTIONS);
});