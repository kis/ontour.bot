const request = require('superagent');
const API_KEY = 'iOAsnWYdLjjhNvvM';

async function fetchLocation(location_query) {
    return request
        .get('http://api.songkick.com/api/3.0/search/locations.json')
        .query({ apikey: API_KEY, query: location_query, per_page: 1 });
}

async function fetchEventsByMetroAreaID(id) {
    return request
        .get(`http://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json`)
        .query({ apikey: API_KEY, per_page: 5 });
}

async function fetchArtist(artist_name) {
    return request
        .get('http://api.songkick.com/api/3.0/search/artists.json')
        .query({ apikey: API_KEY, query: artist_name, per_page: 1 });
}

async function fetchEventsByArtist(artist) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ apikey: API_KEY, per_page: 5 });
}

module.exports = {
    fetchArtist,
    fetchEventsByArtist,
    fetchLocation,
    fetchEventsByMetroAreaID
}
