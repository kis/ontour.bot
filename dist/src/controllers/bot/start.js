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
const instance_1 = require('../../lang/instance');
const logger_1 = require('../../config/logger');
const analysis_1 = require('../../config/analysis');
const constantsEvents = __importStar(
  require('../../constants/constants-events')
);
const cron_1 = require('../../instances/cron');
const _ = __importStar(require('lodash'));
bot_1.default.onText(/\/start/, async (msg) => {
  await logger_1.log(msg, constantsEvents.EVENT_STARTED, 'Start');
  bot_1.default.sendMessage(
    msg.chat.id,
    instance_1.getLanguage().WELCOME(msg.from.first_name),
    constantsReply.REPLY_OPTIONS
  );
  const cronData = await analysis_1.startAnalysis(msg.from.id);
  const cronFunc = _.once(cron_1.createJob);
  cronFunc(msg.chat.id, cronData);
});
//# sourceMappingURL=start.js.map
