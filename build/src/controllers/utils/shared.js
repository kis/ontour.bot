"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../../instances/bot"));
const constantsReply = __importStar(require("../../constants/constants-reply"));
const moment_1 = __importDefault(require("moment"));
const instance_1 = require("../../lang/instance");
async function getDates(datesRes, msg) {
    let fromDate = null;
    let toDate = null;
    switch (datesRes) {
        case '/today':
            fromDate = moment_1.default().format('YYYY-MM-DD');
            toDate = moment_1.default().format('YYYY-MM-DD');
            break;
        case '/next_week':
            fromDate = moment_1.default().format('YYYY-MM-DD');
            toDate = moment_1.default().add(7, 'days').format('YYYY-MM-DD');
            break;
        case '/next_month':
            fromDate = moment_1.default().format('YYYY-MM-DD');
            toDate = moment_1.default().add(31, 'days').format('YYYY-MM-DD');
            break;
        case '/enter_dates':
            fromDate = await askDate(msg.chat.id, instance_1.getLanguage().DATES_FROM);
            toDate = await askDate(msg.chat.id, instance_1.getLanguage().DATES_TO);
            break;
        default:
            break;
    }
    return { fromDate, toDate };
}
exports.getDates = getDates;
async function askDates(chatId) {
    sendMessageWithNext(chatId, instance_1.getLanguage().DATE_COMMANDS);
    return await new Promise((resolve, reject) => {
        bot_1.default.once("message", async (reply) => {
            resolve(reply.text);
        });
    });
}
exports.askDates = askDates;
async function askDate(chatId, date) {
    sendMessageWithNext(chatId, date);
    return await new Promise((resolve, reject) => {
        bot_1.default.once("message", async (reply) => {
            if (reply.text == instance_1.getLanguage().NEXT)
                resolve(null);
            resolve(reply.text);
        });
    });
}
function sendMessageWithNext(chatID, message) {
    bot_1.default.sendMessage(chatID, message, constantsReply.KEYBOARD_NEXT_OPTIONS(instance_1.getLanguage()));
}
exports.sendMessageWithNext = sendMessageWithNext;
//# sourceMappingURL=shared.js.map