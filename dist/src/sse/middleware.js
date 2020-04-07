"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./connection"));
function sseMiddleware(req, res, next) {
    console.log(" sseMiddleware is activated with " + req + " res: " + res);
    res.sseConnection = new connection_1.default(res);
    console.log(" res has now connection  res: " + res.sseConnection);
    next();
}
exports.default = sseMiddleware;
//# sourceMappingURL=middleware.js.map