const request = require('superagent');
const config = require('./config/config');
const constantsSearch = require('./constants/constants-search');

async function fetchLocation(location_query) {
    return request
        .get('http://api.songkick.com/api/3.0/search/locations.json')
        .query({ apikey: config.SONGKICK_API_KEY, query: location_query, per_page: constantsSearch.ITEMS_PER_PAGE });
}

async function fetchEventsByMetroAreaID(id, fromDate, toDate, page) {
    return request
        .get(`http://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json`)
        .query({ apikey: config.SONGKICK_API_KEY, per_page: constantsSearch.EVENTS_PER_PAGE, page: page })
        .query({ min_date: fromDate, max_date: toDate });
}

async function fetchArtist(artist_name) {
    return request
        .get('http://api.songkick.com/api/3.0/search/artists.json')
        .query({ apikey: config.SONGKICK_API_KEY, query: artist_name, per_page: constantsSearch.ITEMS_PER_PAGE });
}

async function fetchEventsByArtist(artist, fromDate, toDate, page) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ apikey: config.SONGKICK_API_KEY, per_page: constantsSearch.EVENTS_PER_PAGE, page: page })
        .query({ min_date: fromDate, max_date: toDate });
}

module.exports = {
    fetchArtist,
    fetchEventsByArtist,
    fetchLocation,
    fetchEventsByMetroAreaID
}
