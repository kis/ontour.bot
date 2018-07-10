const bot = require('../bot');
const { constants } = require('../constants');
const moment = require('moment');

const { getLanguage, setLanguage } = require('../lang/instance');

async function getDates(datesRes, msg) {
    let fromDate = null;
    let toDate = null;

    switch (datesRes) {
        case '/today':
            fromDate = moment().format('YYYY-MM-DD');
            toDate   = moment().format('YYYY-MM-DD');
            break;
        case '/next_week':
            fromDate = moment().format('YYYY-MM-DD');
            toDate   = moment().add(7, 'days').format('YYYY-MM-DD');
            break;
        case '/next_month':
            fromDate = moment().format('YYYY-MM-DD');
            toDate   = moment().add(31, 'days').format('YYYY-MM-DD');
            break;
        case '/enter_dates':
            fromDate = await askFromDate(msg.chat.id);
            toDate   = await askToDate(msg.chat.id);
            break;
        default:
            break;
    }

    return { fromDate, toDate };
}

async function askDates(chatId) {
    sendMessageWithNext(chatId, getLanguage().DATE_COMMANDS, constants.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            resolve(reply.text);
        });
    });
}

async function askFromDate(chatId) {
    sendMessageWithNext(chatId, getLanguage().DATES_FROM);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            if (reply.text == getLanguage().NEXT) resolve(null);
            resolve(reply.text);
        });
    });
}

async function askToDate(chatId) {
    sendMessageWithNext(chatId, getLanguage().DATES_TO);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            if (reply.text == getLanguage().NEXT) resolve(null);
            resolve(reply.text);
        });
    });
}

function sendMessageWithNext(chatID, message) {
    bot.sendMessage(chatID, message, constants.KEYBOARD_NEXT_OPTIONS(getLanguage()));
}

module.exports = {
    getDates,
    askDates,
    sendMessageWithNext
}