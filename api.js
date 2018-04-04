const request = require('superagent');
const API_KEY = 'iOAsnWYdLjjhNvvM';
const ITEMS_PER_PAGE = 1;
const EVENTS_PER_PAGE = 5;

async function fetchLocation(location_query) {
    return request
        .get('http://api.songkick.com/api/3.0/search/locations.json')
        .query({ apikey: API_KEY, query: location_query, per_page: ITEMS_PER_PAGE });
}

async function fetchEventsByMetroAreaID(id, page) {
    return request
        .get(`http://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json`)
        .query({ apikey: API_KEY, per_page: EVENTS_PER_PAGE, page: page });
}

async function fetchArtist(artist_name) {
    return request
        .get('http://api.songkick.com/api/3.0/search/artists.json')
        .query({ apikey: API_KEY, query: artist_name, per_page: ITEMS_PER_PAGE });
}

async function fetchEventsByArtist(artist, page) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ apikey: API_KEY, per_page: EVENTS_PER_PAGE, page: page });
}

module.exports = {
    fetchArtist,
    fetchEventsByArtist,
    fetchLocation,
    fetchEventsByMetroAreaID
}
