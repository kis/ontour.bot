"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const api_1 = require("../../api");
const constantsSearch = __importStar(require("../../constants/constants-search"));
function getEventsListTemplate(eventsList, value, type) {
    let eventTpl;
    if (type === constantsSearch.ARTISTS_SEARCH) {
        let ontourUntil = moment_1.default(value.onTourUntil).format('MMM D, YYYY');
        eventTpl = `<b>${value.displayName.toUpperCase()} CONCERTS
ON TOUR UNTIL ${ontourUntil}</b>\n\n`;
    }
    else if (type === constantsSearch.LOCATIONS_SEARCH) {
        let country = value.country.displayName;
        let city = value.displayName;
        eventTpl = `<b>${city.toUpperCase()} ${country.toUpperCase()} CONCERTS</b>\n\n`;
    }
    return eventsList.event.reduce((acc, event) => {
        let datetime = moment_1.default(event.start.datetime).format('MMM D, YYYY HH:mma');
        let isValid = moment_1.default(datetime, 'MMM D, YYYY HH:mma').isValid();
        if (!isValid)
            datetime = moment_1.default(event.start.date).format('MMM D, YYYY');
        return acc + `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
    }, eventTpl);
}
exports.getEventsListTemplate = getEventsListTemplate;
function getCitiesTemplate(citiesList) {
    let citiesTpl = `<b>CITIES NEAR</b>\n\n`;
    return citiesList.reduce((acc, city) => {
        return acc + `<b>${city.city.displayName}</b>, ${city.city.country.displayName}\n\n`;
    }, citiesTpl);
}
exports.getCitiesTemplate = getCitiesTemplate;
async function getSimilarArtistsTemplate(artist) {
    let similarTpl = `<b>Check similar artists</b>\n\n`;
    const similar = await api_1.fetchSimilarArtists(artist);
    const similarParsed = JSON.parse(similar.text);
    if (!similarParsed || !similarParsed.Similar.Results.length)
        return;
    const { Results } = similarParsed.Similar;
    return Results.reduce((acc, result) => {
        return acc + `<b>${result.Name}</b>\n\n`;
    }, similarTpl);
}
exports.getSimilarArtistsTemplate = getSimilarArtistsTemplate;
async function getArtists(query) {
    let artists = await api_1.fetchArtist(query);
    let artistsParsed = JSON.parse(artists.text);
    return artistsParsed;
}
exports.getArtists = getArtists;
async function getArtistImage(artist) {
    let artistInfo = await api_1.fetchArtistInfo(artist.displayName);
    let artistInfoParsed = JSON.parse(artistInfo.text);
    if (!artistInfoParsed || !artistInfoParsed.artist)
        return;
    return artistInfoParsed.artist.image[3]['#text'];
}
exports.getArtistImage = getArtistImage;
async function getEventsByArtist(artist, fromDate, toDate, page) {
    let events = await api_1.fetchEventsByArtist(artist, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}
exports.getEventsByArtist = getEventsByArtist;
async function getMetroAreas(query) {
    let cities = await api_1.fetchLocation(query);
    let citiesParsed = JSON.parse(cities.text);
    return citiesParsed;
}
exports.getMetroAreas = getMetroAreas;
async function getEventsByMetroAreaID(metroAreaID, fromDate, toDate, page) {
    let events = await api_1.fetchEventsByMetroAreaID(metroAreaID, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}
exports.getEventsByMetroAreaID = getEventsByMetroAreaID;
//# sourceMappingURL=utils.js.map