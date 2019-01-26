const bot = require('./bot');
const CronJob = require('cron').CronJob;
const constantsReply = require('../constants/constants-reply');

const job = null;

function createJob(chatId, messageObj) {
    if (job) {
        job.stop();
    }

    console.log('start cron', chatId, messageObj);

    const artists = messageObj.artists.join(', ');
    const cities = messageObj.cities.join(', ');

    const message = `Today you searched:
Artists: ${artists}
Cities: ${cities}`;

    job = new CronJob('0 * * * *', () => {
        bot.sendMessage(chatId, message, constantsReply.REPLY_OPTIONS);
    }, null, true, 'America/Los_Angeles');

    return job;
}

module.exports = {
    createJob,
}