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
    userId?: any;
    event: number | string | any;
    params: any;
    chat_id: number;
    message_id: number;
    anonymousId?: any;
}
interface IClientData {
    event: number | string | any;
    params: any;
    name: string;
    nick: string;
}
export { IMessage, IEventData, IClientData };
