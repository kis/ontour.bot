declare const langEn: {
    SET_LANG: string;
    LANG_IS: (lang: string) => string;
    WELCOME: (name: string) => string;
    COMMANDS: string;
    DATE_COMMANDS: string;
    BAND: string;
    BAND_SEARCH: (band: string) => string;
    BAND_NOT_FOUND: string;
    LOCATION: string;
    MY_LOCATION: string;
    LOCATION_SEARCH: (location: string) => string;
    LOCATION_NOT_FOUND: string;
    DATES_FROM: string;
    DATES_TO: string;
    EVENTS_NOT_FOUND: string;
    EVENTS_FOUND: (count: number) => string;
    FINISHED: string;
    NEXT: string;
};
export { langEn };