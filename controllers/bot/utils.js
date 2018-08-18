const moment = require('moment');

const { 
    fetchArtist, 
    fetchEventsByArtist, 
    fetchLocation, 
    fetchEventsByMetroAreaID 
} = require('../../api');

const { constants } = require('../../constants/constants');

function getEventsListTemplate(eventsList, value, type) {
    let eventTpl;

    if (type === constants.ARTISTS_SEARCH) {
        let ontourUntil = moment(value.onTourUntil).format('MMM D, YYYY');
        eventTpl = `<b>${value.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;
    } else if (type === constants.LOCATIONS_SEARCH) {
        let country = value.country.displayName;
        let city = value.displayName;
        eventTpl = `<b>${city.toUpperCase()} ${country.toUpperCase()} CONCERTS</b>\n\n`;
    }

    return eventsList.event.reduce((acc, event) => {
        let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
        let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
        if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

        return acc + `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
    }, eventTpl);
}

async function getArtists(query) {
    let artists = await fetchArtist(query);
    let artistsParsed = JSON.parse(artists.text);
    return artistsParsed;
}

async function getEventsByArtist(artist, fromDate, toDate, page) {
    let events = await fetchEventsByArtist(artist, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}

async function getMetroAreas(query) {
    let cities = await fetchLocation(query);
    let citiesParsed = JSON.parse(cities.text);
    return citiesParsed;
}

async function getEventsByMetroAreaID(metroAreaID, fromDate, toDate, page) {
    let events = await fetchEventsByMetroAreaID(metroAreaID, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}

module.exports = {
    getEventsListTemplate,
    getArtists,
    getEventsByArtist,
    getMetroAreas,
    getEventsByMetroAreaID
}