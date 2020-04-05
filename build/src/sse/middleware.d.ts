import express from 'express';
export interface MiddlewareResponse extends express.Response {
    sseConnection?: any;
}
export default function sseMiddleware(req: express.Request, res: MiddlewareResponse, next: express.NextFunction): void;
