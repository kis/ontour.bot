// const Promise = require('bluebird');
// Promise.config({
//   cancellation: true
// });

import * as bot from './bot'
import web from './web'

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
    web(bot);
});