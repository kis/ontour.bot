// const { logEvent } = require('./api');
const { getAnalytics } = require('./analytics');

async function log(event, msg) {
    // const props = {
    //     chat_id: msg.chat.id,
    //     message_id: msg.message_id,
    //     date: msg.date
    // };
    
    // const userProps = {
    //     full_name: [msg.from.first_name, msg.from.last_name].join(' '),
    //     username: msg.from.username,
    //     id: msg.from.id
    // };

    getAnalytics().identify({
        userId: msg.from.id,
        traits: {
            name: [msg.from.first_name, msg.from.last_name].join(' '),
            username: msg.from.username,
            createdAt: new Date(msg.date)
        }
    });

    getAnalytics().track({
        userId: msg.from.id,
        event: event
    });

    // await logEvent(event, msg.chat.id, props, userProps);
} 

module.exports = {
    log
}