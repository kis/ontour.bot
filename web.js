const express = require('express');
const bodyParser = require('body-parser');
const packageInfo = require('./package.json');

const TopicInstance = require('./sse/topic');
const clients = require('./sse/clients');
const sseMiddleware = require('./sse/middleware');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(sseMiddleware);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', function (req, res) {
  res.json({ version: packageInfo.version });
});

app.get('/index', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/topn/updates', function(req,res) {
  var sseConnection = res.sseConnection;
  sseConnection.setup();
  TopicInstance.add(sseConnection);
});

// initialize heartbeat at 10 second interval
clients.initHeartbeat(10);

//process.env.PORT
var server = app.listen('54062', "0.0.0.0", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('Web server started at http://%s:%s', host, port);
});

module.exports = function (bot) {
  app.post('/' + bot.token, function (req, res) {
    console.log('mes', req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};