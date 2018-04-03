const moment = require('moment');
const { ARTISTS_SEARCH, LOCATIONS_SEARCH } = require('./constants');

function renderEventsList(eventsList, value, type) {
    let eventTpl;

    if (type === ARTISTS_SEARCH) {
        let ontourUntil = moment(value.onTourUntil).format('MMM D, YYYY');
        eventTpl = `<b>${value.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;
    } else if (type === LOCATIONS_SEARCH) {
        eventTpl = `<b>${value.city.toUpperCase()} ${value.country.toUpperCase()} CONCERTS</b>\n\n`;
    }

    eventsList.event.map(event => {
        let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
        let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
        if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

        eventTpl += `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
    });

    return eventTpl;
}

module.exports = {
    renderEventsList
}