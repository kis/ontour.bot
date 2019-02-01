const uuid = require('uuid');
const { getAnalytics } = require('./analytics');
const sseClients = require('../sse/clients');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

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
    
        console.log('sent clients sse');
        sseClients.updateSseClients(eventData);

        console.log('log', msg.from.id, msg.chat.id, msg.message_id, msg.from.first_name, msg.from.last_name, msg.from.username);

        const item = {
            TableName: 'ontour_events',
            Item: {
                user_id: {
                    S: String(msg.from.id),
                },
                chat_id: {
                    S: String(msg.chat.id),
                },
                message_id: {
                    S: String(msg.message_id),
                },
                name: {
                    S: [msg.from.first_name, msg.from.last_name].join(' '),
                },
                username: {
                    S: msg.from.username || 'Undefined',
                },
                createdAt: {
                    S: String(msg.date),
                },
                event: {
                    S: event,
                },
                params: {
                    S: params,
                }
            }
        };
    
        dynamodb.putItem(item, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
    } catch(error) {
        console.log("Error", error);
    }
}

module.exports = {
    log
}