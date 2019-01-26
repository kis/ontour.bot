const bot = require('../../instances/bot');
const constantsReply = require('../../constants/constants-reply');
const { getLanguage, setLanguage } = require('../../lang/instance');

const { log } = require('../../config/logger');
const { startAnalysis } = require('../../config/analysis');
const constantsEvents = require('../../constants/constants-events');

const { createJob } = require('../../instances/cron');
const _ = require('lodash');

bot.onText(/\/start/, async msg => {
    await log(msg, constantsEvents.EVENT_STARTED, 'Start');
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constantsReply.REPLY_OPTIONS);
    const cronData = await startAnalysis(msg.from.id);
    const cronFunc = _.once(createJob);
    cronFunc(msg.chat.id, cronData);
});