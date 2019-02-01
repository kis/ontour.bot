"use strict";
const Connection = require('./connection');

console.log("loading sse.js");

function sseMiddleware(req, res, next) {
    console.log(" sseMiddleware is activated with "+ req+" res: "+res);
    res.sseConnection = new Connection(res);
    console.log(" res has now connection  res: "+res.sseConnection );
    next();
}

module.exports = sseMiddleware;