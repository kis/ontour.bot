const bot = require('../../instances/bot');
const constantsReply = require('../../constants/constants-reply');
const constantsEvents = require('../../constants/constants-events');
const constantsLangs = require('../../constants/constants-langs');
const { getLanguage, setLanguage } = require('../../lang/instance');
const { log } = require('../../config/logger');

bot.onText(/\/setlang/, async msg => {
    const chatId = msg.chat.id;
    await askLanguage(chatId);
});

async function askLanguage(chatId) {
    bot.sendMessage(chatId, getLanguage().SET_LANG, constantsReply.KEYBOARD_LANGUAGE_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async (reply) => {
            if (reply.text.indexOf(constantsLangs.LANG_EN) != -1) {
                setLanguage(constantsLangs.LANG_EN);
            } else if (reply.text.indexOf(constantsLangs.LANG_RU) != -1) {
                setLanguage(constantsLangs.LANG_RU);
            } else if (reply.text.indexOf(constantsLangs.LANG_FR) != -1) {
                setLanguage(constantsLangs.LANG_FR);
            }
            await log(reply, constantsEvents.EVENT_LANG_CHANGED, reply.text);
            bot.sendMessage(chatId, getLanguage().LANG_IS(reply.text), constantsReply.REPLY_OPTIONS);
            resolve(true);
        });
    });
}