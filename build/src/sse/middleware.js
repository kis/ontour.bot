"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Connection = require('./connection');
function sseMiddleware(req, res, next) {
    console.log(" sseMiddleware is activated with " + req + " res: " + res);
    res.sseConnection = new Connection(res);
    console.log(" res has now connection  res: " + res.sseConnection);
    next();
}
exports.default = sseMiddleware;
//# sourceMappingURL=middleware.js.map