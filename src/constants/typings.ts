import { Message } from 'node-telegram-bot-api'

interface IMessage extends Message {
    from: {
        id: any;
        first_name: string;
        last_name: string;
        username: string;
        is_bot: any;
    }
}

interface IEventData {
    userId?: number | string | any;
    event: number | string | any;
    params: any;
    chat_id: number | string | any;
    message_id: number | string | any;
    anonymousId?: any;
}

interface IClientData {
    event: number | string | any;
    params: any;
    name: string;
    nick: string;
};

export {
    IMessage,
    IEventData,
    IClientData
}