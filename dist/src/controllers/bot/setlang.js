'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bot_1 = __importDefault(require('../../instances/bot'));
const constantsReply = __importStar(require('../../constants/constants-reply'));
const constantsLangs = __importStar(require('../../constants/constants-langs'));
const instance_1 = require('../../lang/instance');
const logger_1 = require('../../config/logger');
const constantsEvents = __importStar(
  require('../../constants/constants-events')
);
bot_1.default.onText(/\/setlang/, async (msg) => {
  const chatId = msg.chat.id;
  await askLanguage(chatId);
});
async function askLanguage(chatId) {
  bot_1.default.sendMessage(
    chatId,
    instance_1.getLanguage().SET_LANG,
    constantsReply.KEYBOARD_LANGUAGE_OPTIONS
  );
  return await new Promise((resolve, reject) => {
    bot_1.default.once('message', async (reply) => {
      if (reply.text.indexOf(constantsLangs.LANG_EN) != -1) {
        instance_1.setLanguage(constantsLangs.LANG_EN);
      } else if (reply.text.indexOf(constantsLangs.LANG_RU) != -1) {
        instance_1.setLanguage(constantsLangs.LANG_RU);
      } else if (reply.text.indexOf(constantsLangs.LANG_FR) != -1) {
        instance_1.setLanguage(constantsLangs.LANG_FR);
      }
      await logger_1.log(reply, constantsEvents.EVENT_LANG_CHANGED, reply.text);
      bot_1.default.sendMessage(
        chatId,
        instance_1.getLanguage().LANG_IS(reply.text),
        constantsReply.REPLY_OPTIONS
      );
      resolve(true);
    });
  });
}
//# sourceMappingURL=setlang.js.map
