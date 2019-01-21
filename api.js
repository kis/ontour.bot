const request = require('superagent');
const config = require('./config/config');
const constantsSearch = require('./constants/constants-search');
const constantsApi = require('./constants/constants-api');

async function fetchLocation(location_query) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
        .query({ 
            apikey: config.SONGKICK_API_KEY, 
            query: location_query, 
            per_page: constantsSearch.ITEMS_PER_PAGE 
        });
}

async function fetchLocationsByCoords(location) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
        .query({ 
            apikey: config.SONGKICK_API_KEY,
            per_page: constantsSearch.EVENTS_PER_PAGE,
            page: 1,
            location: `geo:${location.latitude},${location.longitude}`
        });
}

async function fetchEventsByMetroAreaID(id, fromDate, toDate, page) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/metro_areas/${id}/calendar.json`)
        .query({ 
            apikey: config.SONGKICK_API_KEY, 
            per_page: constantsSearch.EVENTS_PER_PAGE, 
            page: page 
        })
        .query({ 
            min_date: fromDate, 
            max_date: toDate 
        });
}

async function fetchArtist(artist_name) {
    return request
        .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/artists.json`)
        .query({ 
            apikey: config.SONGKICK_API_KEY, 
            query: artist_name, 
            per_page: constantsSearch.ITEMS_PER_PAGE 
        });
}

async function fetchArtistInfo(artist) {
    return await request
        .get(`${constantsApi.LFM_DOMAIN}/?method=artist.getinfo`)
        .query({
            artist,
            api_key: config.LFM_KEY,
            format: 'json',
        });
  }

async function fetchEventsByArtist(artist, fromDate, toDate, page) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ 
            apikey: config.SONGKICK_API_KEY, 
            per_page: constantsSearch.EVENTS_PER_PAGE, 
            page: page 
        })
        .query({ 
            min_date: fromDate, 
            max_date: toDate 
        });
}

module.exports = {
    fetchArtist,
    fetchArtistInfo,
    fetchEventsByArtist,
    fetchLocation,
    fetchLocationsByCoords,
    fetchEventsByMetroAreaID
}
