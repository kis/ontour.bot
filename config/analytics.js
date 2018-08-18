const config = require('./config');

const Analytics = require('analytics-node');
const analytics = new Analytics(config.SEGMENT_API_KEY);

function getAnalytics() {
    return analytics;
}

module.exports = {
    getAnalytics
};