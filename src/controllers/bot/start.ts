import bot from '../../instances/bot'
import * as constantsReply from '../../constants/constants-reply'
import { getLanguage } from '../../lang/instance'

import { log } from '../../config/logger'
import { startAnalysis } from '../../config/analysis'
import * as constantsEvents from '../../constants/constants-events'

import { createJob } from '../../instances/cron'
import * as _ from 'lodash'

bot.onText(/\/start/, async (msg: any) => {
    await log(msg, constantsEvents.EVENT_STARTED, 'Start');
    bot.sendMessage(msg.chat.id, getLanguage().WELCOME(msg.from.first_name), constantsReply.REPLY_OPTIONS);
    const cronData: any = await startAnalysis(msg.from.id);
    const cronFunc = _.once(createJob);
    cronFunc(msg.chat.id, cronData);
});