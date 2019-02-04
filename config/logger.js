const uuid = require('uuid');
const { getAnalytics } = require('./analytics');
const sseClients = require('../sse/clients');
const { putData } = require('./dynamo-db');

async function log(msg, event, params) {
    try {
        getAnalytics().identify({
            userId: msg.from.id,
            traits: {
                name: [msg.from.first_name, msg.from.last_name].join(' '),
                username: msg.from.username,
                createdAt: msg.date
            }
        });
    
        const eventData = {
            userId: msg.from.id,
            event: event,
            params: params,
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

        sseClients.updateSseClients(clientData);

        putData(msg, event, params);
    } catch(error) {
        console.log("Error", error);
    }
}

module.exports = {
    log
}