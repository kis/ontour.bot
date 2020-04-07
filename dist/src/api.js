"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = __importStar(require("superagent"));
const constantsSearch = __importStar(require("./constants/constants-search"));
const constantsApi = __importStar(require("./constants/constants-api"));
const { SONGKICK_API_KEY, LFM_KEY, TASTEDIVE_API_KEY } = require('./config/config');
async function fetchLocation(location_query) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
        .query({
        apikey: SONGKICK_API_KEY,
        query: location_query,
        per_page: constantsSearch.ITEMS_PER_PAGE
    });
}
exports.fetchLocation = fetchLocation;
async function fetchLocationsByCoords(location) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
        .query({
        apikey: SONGKICK_API_KEY,
        per_page: constantsSearch.EVENTS_PER_PAGE,
        page: 1,
        location: `geo:${location.latitude},${location.longitude}`
    });
}
exports.fetchLocationsByCoords = fetchLocationsByCoords;
async function fetchEventsByMetroAreaID(id, fromDate, toDate, page) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/metro_areas/${id}/calendar.json`)
        .query({
        apikey: SONGKICK_API_KEY,
        per_page: constantsSearch.EVENTS_PER_PAGE,
        page: page
    })
        .query({
        min_date: fromDate,
        max_date: toDate
    });
}
exports.fetchEventsByMetroAreaID = fetchEventsByMetroAreaID;
async function fetchArtist(artist_name) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/artists.json`)
        .query({
        apikey: SONGKICK_API_KEY,
        query: artist_name,
        per_page: constantsSearch.ITEMS_PER_PAGE
    });
}
exports.fetchArtist = fetchArtist;
async function fetchArtistInfo(artist) {
    return await request
        .get(`${constantsApi.LFM_DOMAIN}/?method=artist.getinfo`)
        .query({
        artist,
        api_key: LFM_KEY,
        format: 'json',
    });
}
exports.fetchArtistInfo = fetchArtistInfo;
async function fetchEventsByArtist(artist, fromDate, toDate, page) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({
        apikey: SONGKICK_API_KEY,
        per_page: constantsSearch.EVENTS_PER_PAGE,
        page: page
    })
        .query({
        min_date: fromDate,
        max_date: toDate
    });
}
exports.fetchEventsByArtist = fetchEventsByArtist;
async function fetchSimilarArtists(artist) {
    return request
        .get(`${constantsApi.TASTEDIVE_API_DOMAIN}`)
        .query({
        k: TASTEDIVE_API_KEY,
        q: artist,
    });
}
exports.fetchSimilarArtists = fetchSimilarArtists;
//# sourceMappingURL=api.js.map