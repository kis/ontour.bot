'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const node_telegram_bot_api_1 = __importDefault(
  require('node-telegram-bot-api')
);
const { TELEGRAM_TOKEN, HEROKU_URL } = require('../config/config');
let bot;
if (process.env.NODE_ENV === 'production') {
  bot = new node_telegram_bot_api_1.default(TELEGRAM_TOKEN);
  bot.setWebHook(HEROKU_URL + bot.token);
} else {
  bot = new node_telegram_bot_api_1.default(TELEGRAM_TOKEN, { polling: true });
}
exports.default = bot;
//# sourceMappingURL=bot.js.map
