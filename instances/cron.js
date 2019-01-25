const bot = require('./bot');
const CronJob = require('cron').CronJob;
const constantsReply = require('../constants/constants-reply');

function createJob(chatId, messageObj) {
    console.log('start cron', chatId, messageObj);

    const artists = messageObj.artists.join(', ');
    const cities = messageObj.cities.join(', ');

    const message = `Today you searched:
Artists: ${artists}
Cities: ${cities}`;

    return new CronJob('0 * * * *', () => {
        bot.sendMessage(chatId, message, constantsReply.REPLY_OPTIONS);
    }, null, true, 'America/Los_Angeles');
}

module.exports = {
    createJob,
}