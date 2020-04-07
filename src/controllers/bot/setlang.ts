import bot from '../../instances/bot';
import * as constantsReply from '../../constants/constants-reply';
import * as constantsLangs from '../../constants/constants-langs';
import { getLanguage, setLanguage } from '../../lang/instance';
import { log } from '../../config/logger';
import * as constantsEvents from '../../constants/constants-events';

bot.onText(/\/setlang/, async (msg: any) => {
  const chatId = msg.chat.id;
  await askLanguage(chatId);
});

async function askLanguage(chatId: number) {
  bot.sendMessage(
    chatId,
    getLanguage().SET_LANG,
    constantsReply.KEYBOARD_LANGUAGE_OPTIONS
  );
  return await new Promise((resolve, reject) => {
    bot.once('message', async (reply: any) => {
      if (reply.text.indexOf(constantsLangs.LANG_EN) != -1) {
        setLanguage(constantsLangs.LANG_EN);
      } else if (reply.text.indexOf(constantsLangs.LANG_RU) != -1) {
        setLanguage(constantsLangs.LANG_RU);
      } else if (reply.text.indexOf(constantsLangs.LANG_FR) != -1) {
        setLanguage(constantsLangs.LANG_FR);
      }
      await log(reply, constantsEvents.EVENT_LANG_CHANGED, reply.text);
      bot.sendMessage(
        chatId,
        getLanguage().LANG_IS(reply.text),
        constantsReply.REPLY_OPTIONS
      );
      resolve(true);
    });
  });
}
