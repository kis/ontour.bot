import bot from './bot';
import { CronJob } from 'cron';
import * as constantsReply from '../constants/constants-reply';

interface MessageObj {
  artists: Array<string>;
  cities: Array<string>;
}

let job: any = null;

function createJob(chatId: number, messageObj: MessageObj) {
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
  job = new CronJob(
    '0 0 * * 0',
    () => {
      bot.sendPhoto(chatId, photoUrl, constantsReply.REPLY_OPTIONS);
      bot.sendMessage(chatId, message, constantsReply.REPLY_OPTIONS);
    },
    null,
    true,
    'America/Los_Angeles'
  );

  return job;
}

export { createJob };
