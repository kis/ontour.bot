const { constants } = require('../constants/constants');

const Analytics = require('analytics-node');
const analytics = new Analytics(constants.SEGMENT_API_KEY);

function getAnalytics() {
    return analytics;
}

module.exports = {
    getAnalytics
};