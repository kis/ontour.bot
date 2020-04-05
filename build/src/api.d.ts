import * as request from 'superagent';
declare function fetchLocation(location_query: string): Promise<request.Response>;
declare function fetchLocationsByCoords(location: {
    latitude: any;
    longitude: any;
}): Promise<request.Response>;
declare function fetchEventsByMetroAreaID(id: number, fromDate: any, toDate: any, page: number): Promise<request.Response>;
declare function fetchArtist(artist_name: string): Promise<request.Response>;
declare function fetchArtistInfo(artist: string): Promise<request.Response>;
declare function fetchEventsByArtist(artist: any, fromDate: any, toDate: any, page: number): Promise<request.Response>;
declare function fetchSimilarArtists(artist: string): Promise<request.Response>;
export { fetchArtist, fetchArtistInfo, fetchEventsByArtist, fetchLocation, fetchLocationsByCoords, fetchEventsByMetroAreaID, fetchSimilarArtists, };
