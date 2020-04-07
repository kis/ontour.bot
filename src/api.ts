import * as request from 'superagent';
import * as constantsSearch from './constants/constants-search';
import * as constantsApi from './constants/constants-api';

const {
  SONGKICK_API_KEY,
  LFM_KEY,
  TASTEDIVE_API_KEY,
} = require('./config/config');

async function fetchLocation(location_query: string) {
  return request
    .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
    .query({
      apikey: SONGKICK_API_KEY,
      query: location_query,
      per_page: constantsSearch.ITEMS_PER_PAGE,
    });
}

async function fetchLocationsByCoords(location: {
  latitude: any;
  longitude: any;
}) {
  return request
    .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/locations.json`)
    .query({
      apikey: SONGKICK_API_KEY,
      per_page: constantsSearch.EVENTS_PER_PAGE,
      page: 1,
      location: `geo:${location.latitude},${location.longitude}`,
    });
}

async function fetchEventsByMetroAreaID(
  id: number,
  fromDate: any,
  toDate: any,
  page: number
) {
  return request
    .get(`${constantsApi.SONGSICK_API_DOMAIN}/metro_areas/${id}/calendar.json`)
    .query({
      apikey: SONGKICK_API_KEY,
      per_page: constantsSearch.EVENTS_PER_PAGE,
      page: page,
    })
    .query({
      min_date: fromDate,
      max_date: toDate,
    });
}

async function fetchArtist(artist_name: string) {
  return request
    .get(`${constantsApi.SONGSICK_API_DOMAIN}/search/artists.json`)
    .query({
      apikey: SONGKICK_API_KEY,
      query: artist_name,
      per_page: constantsSearch.ITEMS_PER_PAGE,
    });
}

async function fetchArtistInfo(artist: string) {
  return await request
    .get(`${constantsApi.LFM_DOMAIN}/?method=artist.getinfo`)
    .query({
      artist,
      api_key: LFM_KEY,
      format: 'json',
    });
}

async function fetchEventsByArtist(
  artist: any,
  fromDate: any,
  toDate: any,
  page: number
) {
  return request
    .get(artist.identifier[0].eventsHref)
    .query({
      apikey: SONGKICK_API_KEY,
      per_page: constantsSearch.EVENTS_PER_PAGE,
      page: page,
    })
    .query({
      min_date: fromDate,
      max_date: toDate,
    });
}

async function fetchSimilarArtists(artist: string) {
  return request.get(`${constantsApi.TASTEDIVE_API_DOMAIN}`).query({
    k: TASTEDIVE_API_KEY,
    q: artist,
  });
}

export {
  fetchArtist,
  fetchArtistInfo,
  fetchEventsByArtist,
  fetchLocation,
  fetchLocationsByCoords,
  fetchEventsByMetroAreaID,
  fetchSimilarArtists,
};
