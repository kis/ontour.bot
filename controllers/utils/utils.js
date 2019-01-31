const moment = require('moment');

const { 
    fetchArtist, 
    fetchArtistInfo,
    fetchEventsByArtist, 
    fetchLocation, 
    fetchEventsByMetroAreaID,
    fetchSimilarArtists, 
} = require('../../api');

const constantsSearch = require('../../constants/constants-search');

function getEventsListTemplate(eventsList, value, type) {
    let eventTpl;

    if (type === constantsSearch.ARTISTS_SEARCH) {
        let ontourUntil = moment(value.onTourUntil).format('MMM D, YYYY');
        eventTpl = `<b>${value.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;
    } else if (type === constantsSearch.LOCATIONS_SEARCH) {
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

function getCitiesTemplate(citiesList) {
    let citiesTpl = `<b>CITIES NEAR</b>\n\n`;

    return citiesList.reduce((acc, city) => {
        return acc + `<b>${city.city.displayName}</b>, ${city.city.country.displayName}\n\n`;
    }, citiesTpl);
}

function getSimilarArtistsTemplate(artist) {
    let similarTpl = `<b>Check similar artists</b>\n\n`;

    const q = artist.replace(' ', '+');
    const similar = await fetchSimilarArtists(q);
    const similarParsed = JSON.parse(similar.text);
    if (!similarParsed || !similarParsed.Similar.Results.length) return;
    console.log(similarParsed);

    const { Results } = similarParsed.Similar;

    return Results.reduce((acc, result) => {
        return acc + `<b>${result.Name}</b>\n\n`;
    }, similarTpl);
}

async function getArtists(query) {
    let artists = await fetchArtist(query);
    let artistsParsed = JSON.parse(artists.text);
    return artistsParsed;
}

async function getArtistImage(artist) {
    let artistInfo = await fetchArtistInfo(artist.displayName);
    let artistInfoParsed = JSON.parse(artistInfo.text);
    if (!artistInfoParsed || !artistInfoParsed.artist) return;
    return artistInfoParsed.artist.image[3]['#text'];
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
    getCitiesTemplate,
    getArtists,
    getSimilarArtistsTemplate,
    getArtistImage,
    getEventsByArtist,
    getMetroAreas,
    getEventsByMetroAreaID
}