const moment = require('moment');

const { 
    fetchArtist, 
    fetchEventsByArtist, 
    fetchLocation, 
    fetchEventsByMetroAreaID 
} = require('./api');

const { ARTISTS_SEARCH, LOCATIONS_SEARCH } = require('./constants');

function renderEventsList(eventsList, value, type) {
    let eventTpl;

    if (type === ARTISTS_SEARCH) {
        let ontourUntil = moment(value.onTourUntil).format('MMM D, YYYY');
        eventTpl = `<b>${value.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;
    } else if (type === LOCATIONS_SEARCH) {
        let country = value.country.displayName;
        let city = value.displayName;
        eventTpl = `<b>${city.toUpperCase()} ${country.toUpperCase()} CONCERTS</b>\n\n`;
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

async function getArtists(query) {
    let artists = await fetchArtist(query);
    let artistsParsed = JSON.parse(artists.text);
    return artistsParsed;
}

async function getEventsByArtist(artist, page) {
    let events = await fetchEventsByArtist(artist, page);
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

async function getEventsByMetroAreaID(metroAreaID, page) {
    let events = await fetchEventsByMetroAreaID(metroAreaID, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}

module.exports = {
    renderEventsList,
    getArtists,
    getEventsByArtist,
    getMetroAreas,
    getEventsByMetroAreaID
}