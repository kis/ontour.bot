import Analytics from 'analytics-node'

const { SEGMENT_API_KEY } = require ('./config')

const analytics = new Analytics(SEGMENT_API_KEY);

function getAnalytics() {
    return analytics;
}

export {
    getAnalytics,
    Analytics
}