const { getAnalytics } = require('./analytics');

async function log(msg, event, params) {
    getAnalytics().identify({
        userId: msg.from.id,
        traits: {
            name: [msg.from.first_name, msg.from.last_name].join(' '),
            username: msg.from.username,
            createdAt: msg.date
        }
    });

    getAnalytics().track({
        userId: msg.from.id,
        event: event,
        params: params,
        chat_id: msg.chat.id,
        message_id: msg.message_id
    });
} 

module.exports = {
    log
}