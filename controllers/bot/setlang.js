const bot = require('../../instances/bot');
const { constants } = require('../../constants/constants');
const { getLanguage, setLanguage } = require('../../lang/instance');
const { log } = require('../../config/logger');

bot.onText(/\/setlang/, async msg => {
    const chatId = msg.chat.id;
    await askLanguage(chatId);
});

async function askLanguage(chatId) {
    bot.sendMessage(chatId, getLanguage().SET_LANG, constants.KEYBOARD_LANGUAGE_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async (reply) => {
            if (reply.text.indexOf(constants.LANG_EN) != -1) {
                setLanguage(constants.LANG_EN);
            } else if (reply.text.indexOf(constants.LANG_RU) != -1) {
                setLanguage(constants.LANG_RU);
            } else if (reply.text.indexOf(constants.LANG_FR) != -1) {
                setLanguage(constants.LANG_FR);
            }
            await log(reply, constants.EVENT_LANG_CHANGED, reply.text);
            bot.sendMessage(chatId, getLanguage().LANG_IS(reply.text), constants.REPLY_OPTIONS);
            resolve(true);
        });
    });
}