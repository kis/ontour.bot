import { getAnalytics } from './analytics'
import updateSseClients from '../sse/clients'
import { putData } from './dynamo-db'
import { IMessage } from '../constants/typings'

async function log(msg: IMessage, event: string, params: any) {
    try {
        getAnalytics().identify({
            userId: msg.from.id,
            traits: {
                name: [msg.from.first_name, msg.from.last_name].join(' '),
                username: msg.from.username,
                createdAt: msg.date
            }
        });
    
        const eventData: any = {
            userId: msg.from.id,
            event,
            params,
            chat_id: msg.chat.id,
            message_id: msg.message_id
        };

        getAnalytics().track(eventData);
    
        const clientData = {
            event: event,
            params: params,
            name: [msg.from.first_name, msg.from.last_name].join(' '),
            nick: msg.from.username || 'Undefined',
        };

        updateSseClients(clientData);

        await putData(msg, event, params);
    } catch(error) {
        console.log("Error", error);
    }
}

export {
    log
}