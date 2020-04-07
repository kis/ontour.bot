import express from 'express'
import * as bodyParser from 'body-parser'
import path from 'path'

import TopicInstance from './sse/topic'
import { MiddlewareResponse } from './sse/middleware'
import sseMiddleware from './sse/middleware'

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(sseMiddleware);

app.use((_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/index', (_req: express.Request, res: express.Response) => {
  res.sendfile(path.resolve(__dirname, '../../client/index.html'));
});

app.get('/topn/updates', (_req: express.Request, res: MiddlewareResponse) => {
  let sseConnection = res.sseConnection;
  sseConnection.setup();
  TopicInstance.add(sseConnection);
});

//process.env.PORT
const server: any = app.listen(54062, "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});

export default function (bot: any) {
  app.post('/' + process.env.TELEGRAM_TOKEN, (req: express.Request, res: express.Response) => {
    console.log('mes', req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};