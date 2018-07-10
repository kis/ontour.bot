require("dotenv").config();

const bot = require('./bot');
const artists = require('./bot/artists');
const locations = require('./bot/locations');
require('./web')(bot);