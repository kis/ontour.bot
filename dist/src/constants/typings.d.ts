import { Message } from 'node-telegram-bot-api';
interface IMessage extends Message {
  from: {
    id: any;
    first_name: string;
    last_name: string;
    username: string;
    is_bot: any;
  };
}
interface IEventData {
  userId?: string | number;
  anonymousId?: string | number;
  event: string;
  properties?: any;
  timestamp?: Date;
  context?: any;
  integrations?: any;
  params?: any;
  chat_id?: any;
  message_id?: any;
}
interface IClientData {
  event: number | string | any;
  params: any;
  name: string;
  nick: string;
}
export { IMessage, IEventData, IClientData };
