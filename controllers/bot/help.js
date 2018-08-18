const bot = require('../../instances/bot');
const { constants } = require('../../constants/constants');
const { getLanguage, setLanguage } = require('../../lang/instance');

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, getLanguage().COMMANDS, constants.REPLY_OPTIONS);
});