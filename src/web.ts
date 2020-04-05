import express from 'express'
import * as bodyParser from 'body-parser'

import TopicInstance from './sse/topic'
import { MiddlewareResponse } from './sse/middleware'
import sseMiddleware from './sse/middleware'

const packageInfo = require('./package.json')

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(sseMiddleware);

app.use(function (_req: express.Request, res: express.Response, next: express.NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', function (_req: express.Request, res: express.Response) {
  res.json({ version: packageInfo.version });
});

app.get('/index', function (_req: express.Request, res: express.Response) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/topn/updates', function(_req: express.Request, res: MiddlewareResponse) {
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
  app.post('/' + bot.token, function (req: express.Request, res: express.Response) {
    console.log('mes', req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};