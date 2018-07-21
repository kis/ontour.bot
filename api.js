const request = require('superagent');
const { constants } = require('./constants');

async function logEvent(event, userID, props, userProps) {
    let eventData = {
        user_id: userID,
        event_type: event
    };

    if (props) {
        eventData.event_properties = props;
    }
    if (userProps) {
        eventData.user_properties = userProps;
    }

    return request
        .post('https://api.amplitude.com/httpapi')
        .query({ api_key: constants.AMPLITUDE_API_KEY, event: JSON.stringify(eventData) });
}

async function fetchLocation(location_query) {
    return request
        .get('http://api.songkick.com/api/3.0/search/locations.json')
        .query({ apikey: constants.API_KEY, query: location_query, per_page: constants.ITEMS_PER_PAGE });
}

async function fetchEventsByMetroAreaID(id, fromDate, toDate, page) {
    return request
        .get(`http://api.songkick.com/api/3.0/metro_areas/${id}/calendar.json`)
        .query({ apikey: constants.API_KEY, per_page: constants.EVENTS_PER_PAGE, page: page })
        .query({ min_date: fromDate, max_date: toDate });
}

async function fetchArtist(artist_name) {
    return request
        .get('http://api.songkick.com/api/3.0/search/artists.json')
        .query({ apikey: constants.API_KEY, query: artist_name, per_page: constants.ITEMS_PER_PAGE });
}

async function fetchEventsByArtist(artist, fromDate, toDate, page) {
    return request
        .get(artist.identifier[0].eventsHref)
        .query({ apikey: constants.API_KEY, per_page: constants.EVENTS_PER_PAGE, page: page })
        .query({ min_date: fromDate, max_date: toDate });
}

module.exports = {
    logEvent,
    fetchArtist,
    fetchEventsByArtist,
    fetchLocation,
    fetchEventsByMetroAreaID
}
