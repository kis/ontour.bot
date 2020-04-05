"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const analytics_1 = require("./analytics");
const clients_1 = __importDefault(require("../sse/clients"));
const dynamo_db_1 = require("./dynamo-db");
async function log(msg, event, params) {
    try {
        analytics_1.getAnalytics().identify({
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
        analytics_1.getAnalytics().track(eventData);
        const clientData = {
            event: event,
            params: params,
            name: [msg.from.first_name, msg.from.last_name].join(' '),
            nick: msg.from.username || 'Undefined',
        };
        clients_1.default(clientData);
        await dynamo_db_1.putData(msg, event, params);
    }
    catch (error) {
        console.log("Error", error);
    }
}
exports.log = log;
//# sourceMappingURL=logger.js.map