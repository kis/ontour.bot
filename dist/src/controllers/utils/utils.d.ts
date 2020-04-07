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
declare function getEventsListTemplate(eventsList: any, value: Event, type: any): any;
declare function getCitiesTemplate(citiesList: Array<any>): string;
declare function getSimilarArtistsTemplate(artist: string): Promise<any>;
declare function getArtists(query: string): Promise<any>;
declare function getArtistImage(artist: {
    displayName: string;
}): Promise<any>;
declare function getEventsByArtist(artist: any, fromDate: any, toDate: any, page: number): Promise<{
    eventsList: any;
    eventsCount: any;
}>;
declare function getMetroAreas(query: string): Promise<any>;
declare function getEventsByMetroAreaID(metroAreaID: number, fromDate: any, toDate: any, page: number): Promise<{
    eventsList: any;
    eventsCount: any;
}>;
export { getEventsListTemplate, getCitiesTemplate, getArtists, getSimilarArtistsTemplate, getArtistImage, getEventsByArtist, getMetroAreas, getEventsByMetroAreaID };
