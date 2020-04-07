"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const topic_1 = __importDefault(require("./topic"));
function updateSseClients(message) {
    topic_1.default.connections.forEach((sseConnection) => {
        sseConnection.send(message);
    });
}
exports.default = updateSseClients;
//# sourceMappingURL=clients.js.map