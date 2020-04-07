import { Message } from 'node-telegram-bot-api';
declare function getDates(
  datesRes: any,
  msg: Message
): Promise<{
  fromDate: unknown;
  toDate: unknown;
}>;
declare function askDates(chatId: number): Promise<unknown>;
declare function sendMessageWithNext(
  chatID: string | number,
  message: string
): void;
export { getDates, askDates, sendMessageWithNext };
