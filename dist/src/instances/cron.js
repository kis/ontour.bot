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
const bot_1 = __importDefault(require('./bot'));
const cron_1 = require('cron');
const constantsReply = __importStar(require('../constants/constants-reply'));
let job = null;
function createJob(chatId, messageObj) {
  if (job) {
    job.stop();
  }
  console.log('start cron', chatId, messageObj);
  const artists = messageObj.artists.join(', ');
  const cities = messageObj.cities.join(', ');
  const message = `<b>You searched</b>:\n\n
<b>Artists:</b> ${artists}\n\n
<b>Cities:</b> ${cities}\n\n`;
  const photoUrl =
    'https://cdn.pixabay.com/photo/2016/11/29/06/17/audience-1867754_960_720.jpg';
  // '0 0 * * 0' every week
  // '* * * * *' every minute
  // '0 0 1 * *' every month
  job = new cron_1.CronJob(
    '0 0 * * 0',
    () => {
      bot_1.default.sendPhoto(chatId, photoUrl, constantsReply.REPLY_OPTIONS);
      bot_1.default.sendMessage(chatId, message, constantsReply.REPLY_OPTIONS);
    },
    null,
    true,
    'America/Los_Angeles'
  );
  return job;
}
exports.createJob = createJob;
//# sourceMappingURL=cron.js.map
