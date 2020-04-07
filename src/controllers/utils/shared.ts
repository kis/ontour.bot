import bot from '../../instances/bot';
import * as constantsReply from '../../constants/constants-reply';
import moment from 'moment';
import { Message } from 'node-telegram-bot-api';
import { getLanguage } from '../../lang/instance';

async function getDates(datesRes: any, msg: Message) {
  let fromDate = null;
  let toDate = null;

  switch (datesRes) {
    case '/today':
      fromDate = moment().format('YYYY-MM-DD');
      toDate = moment().format('YYYY-MM-DD');
      break;
    case '/next_week':
      fromDate = moment().format('YYYY-MM-DD');
      toDate = moment().add(7, 'days').format('YYYY-MM-DD');
      break;
    case '/next_month':
      fromDate = moment().format('YYYY-MM-DD');
      toDate = moment().add(31, 'days').format('YYYY-MM-DD');
      break;
    case '/enter_dates':
      fromDate = await askDate(msg.chat.id, getLanguage().DATES_FROM);
      toDate = await askDate(msg.chat.id, getLanguage().DATES_TO);
      break;
    default:
      break;
  }

  return { fromDate, toDate };
}

async function askDates(chatId: number) {
  sendMessageWithNext(chatId, getLanguage().DATE_COMMANDS);
  return await new Promise((resolve, reject) => {
    bot.once('message', async (reply: any) => {
      resolve(reply.text);
    });
  });
}

async function askDate(chatId: number, date: any) {
  sendMessageWithNext(chatId, date);
  return await new Promise((resolve, reject) => {
    bot.once('message', async (reply: any) => {
      if (reply.text == getLanguage().NEXT) resolve(null);
      resolve(reply.text);
    });
  });
}

function sendMessageWithNext(chatID: string | number, message: string) {
  bot.sendMessage(
    chatID,
    message,
    constantsReply.KEYBOARD_NEXT_OPTIONS(getLanguage())
  );
}

export { getDates, askDates, sendMessageWithNext };
