import express from 'express'

const Connection = require('./connection');

export interface MiddlewareResponse extends express.Response {
    sseConnection?: any;
}

export default function sseMiddleware(req: express.Request, res: MiddlewareResponse, next: express.NextFunction) {
    console.log(" sseMiddleware is activated with "+ req+" res: "+res);
    res.sseConnection = new Connection(res);
    console.log(" res has now connection  res: "+res.sseConnection );
    next();
}