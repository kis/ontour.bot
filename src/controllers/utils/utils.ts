import moment from 'moment'
import {
    fetchArtist, 
    fetchArtistInfo,
    fetchEventsByArtist, 
    fetchLocation, 
    fetchEventsByMetroAreaID,
    fetchSimilarArtists, 
} from '../../api'
import * as constantsSearch from '../../constants/constants-search'

interface Event {
    displayName: string;
    start: {
        datetime: any;
        date: any;
    };
    location: {
        city: string;
    };
    country: {
        displayName: string;
    };
    onTourUntil?: any;
}

function getEventsListTemplate(eventsList: any, value: Event, type: any) {
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

    return eventsList.event.reduce((acc: string, event: Event) => {
        let datetime = moment(event.start.datetime).format('MMM D, YYYY HH:mma');
        let isValid = moment(datetime, 'MMM D, YYYY HH:mma').isValid();
        if (!isValid) datetime = moment(event.start.date).format('MMM D, YYYY');

        return acc + `<b>🎤 ${event.displayName}</b>
📌 ${event.location.city}
🕘 ${datetime}\n\n`;
    }, eventTpl);
}

function getCitiesTemplate(citiesList: Array<any>) {
    let citiesTpl = `<b>CITIES NEAR</b>\n\n`;

    return citiesList.reduce((acc: string, city: any) => {
        return acc + `<b>${city.city.displayName}</b>, ${city.city.country.displayName}\n\n`;
    }, citiesTpl);
}

async function getSimilarArtistsTemplate(artist: string) {
    let similarTpl = `<b>Check similar artists</b>\n\n`;
    const similar = await fetchSimilarArtists(artist);
    const similarParsed = JSON.parse(similar.text);
    if (!similarParsed || !similarParsed.Similar.Results.length) return;
    const { Results } = similarParsed.Similar;
    return Results.reduce((acc: string, result: any) => {
        return acc + `<b>${result.Name}</b>\n\n`;
    }, similarTpl);
}

async function getArtists(query: string) {
    let artists = await fetchArtist(query);
    let artistsParsed = JSON.parse(artists.text);
    return artistsParsed;
}

async function getArtistImage(artist: { displayName: string }) {
    let artistInfo = await fetchArtistInfo(artist.displayName);
    let artistInfoParsed = JSON.parse(artistInfo.text);
    if (!artistInfoParsed || !artistInfoParsed.artist) return;
    return artistInfoParsed.artist.image[3]['#text'];
}

async function getEventsByArtist(artist: any, fromDate: any, toDate: any, page: number) {
    let events = await fetchEventsByArtist(artist, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}

async function getMetroAreas(query: string) {
    let cities = await fetchLocation(query);
    let citiesParsed = JSON.parse(cities.text);
    return citiesParsed;
}

async function getEventsByMetroAreaID(metroAreaID: number, fromDate: any, toDate: any, page: number) {
    let events = await fetchEventsByMetroAreaID(metroAreaID, fromDate, toDate, page);
    let eventsParsed = JSON.parse(events.text);
    let results = eventsParsed.resultsPage;
    let eventsList = results.results;
    let eventsCount = results.totalEntries;
    return { eventsList, eventsCount };
}

export {
    getEventsListTemplate,
    getCitiesTemplate,
    getArtists,
    getSimilarArtistsTemplate,
    getArtistImage,
    getEventsByArtist,
    getMetroAreas,
    getEventsByMetroAreaID
}