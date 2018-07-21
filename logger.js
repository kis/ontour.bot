const { logEvent } = require('./api');

async function log(event, msg) {
    const props = {
        chat_id: msg.chat.id,
        message_id: msg.message_id,
        date: msg.date
    };
    const userProps = {
        full_name: [msg.from.first_name, msg.from.last_name].join(' '),
        username: msg.from.username,
        id: msg.from.id
    };
    await logEvent(event, msg.chat.id, props, userProps);
} 

module.exports = {
    log
}