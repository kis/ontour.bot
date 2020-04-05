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
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const topic_1 = __importDefault(require("./sse/topic"));
const middleware_1 = __importDefault(require("./sse/middleware"));
const packageInfo = require('./package.json');
const app = express_1.default();
app.use(bodyParser.json());
app.use(express_1.default.static(__dirname));
app.use(middleware_1.default);
app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
app.get('/', function (_req, res) {
    res.json({ version: packageInfo.version });
});
app.get('/index', function (_req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/topn/updates', function (_req, res) {
    let sseConnection = res.sseConnection;
    sseConnection.setup();
    topic_1.default.add(sseConnection);
});
//process.env.PORT
const server = app.listen(54062, "0.0.0.0", () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Web server started at http://%s:%s', host, port);
});
function default_1(bot) {
    app.post('/' + bot.token, function (req, res) {
        console.log('mes', req.body);
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });
}
exports.default = default_1;
;
//# sourceMappingURL=web.js.map