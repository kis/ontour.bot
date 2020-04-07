"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../../instances/bot"));
const constantsReply = __importStar(require("../../constants/constants-reply"));
const instance_1 = require("../../lang/instance");
const logger_1 = require("../../config/logger");
const constantsEvents = __importStar(require("../../constants/constants-events"));
bot_1.default.onText(/\/help/, async (msg) => {
    await logger_1.log(msg, constantsEvents.EVENT_HELP, 'Help');
    bot_1.default.sendMessage(msg.chat.id, instance_1.getLanguage().COMMANDS, constantsReply.REPLY_OPTIONS);
});
//# sourceMappingURL=help.js.map