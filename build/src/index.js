"use strict";
// const Promise = require('bluebird');
// Promise.config({
//   cancellation: true
// });
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot = __importStar(require("./bot"));
const web_1 = __importDefault(require("./web"));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config();
}
const Raven = require('raven');
Raven.config('https://3d8641fee61f425c9af50b4c8bbc11ef@sentry.io/1247513').install();
process.on('uncaughtException', (err) => {
    console.log('There was an uncaught error', err);
    process.exit(1);
});
Raven.context(function () {
    web_1.default(bot);
});
//# sourceMappingURL=index.js.map