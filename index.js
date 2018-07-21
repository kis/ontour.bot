require("dotenv").config();

const Raven = require('raven');
Raven.config('https://3d8641fee61f425c9af50b4c8bbc11ef@sentry.io/1247513').install();

Raven.context(function () {
    const bot = require('./bot');
    const artists = require('./bot/artists');
    const locations = require('./bot/locations');
    require('./web')(bot);
});