import bot from '../../instances/bot';
import * as constantsReply from '../../constants/constants-reply';
import { getLanguage } from '../../lang/instance';
import { log } from '../../config/logger';
import * as constantsEvents from '../../constants/constants-events';
import { IMessage } from '../../constants/typings';

bot.onText(/\/help/, async (msg: IMessage) => {
  await log(msg, constantsEvents.EVENT_HELP, 'Help');
  bot.sendMessage(
    msg.chat.id,
    getLanguage().COMMANDS,
    constantsReply.REPLY_OPTIONS
  );
});
