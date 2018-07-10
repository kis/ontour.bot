let searchType = null;
let searchPage = 0;
let artistSearchParams = null;
let locationSearchParams = null;

function setSearchType(type) {
    searchType = type;
}

function getSearchType() {
    return searchType;
}

function setSearchPage(page) {
    searchPage = page;
}

function getSearchPage() {
    return searchPage;
}

function setArtistSearchParams(params) {
    artistSearchParams = params;
}

function getArtistSearchParams() {
    return artistSearchParams;
}

function setLocationSearchParams(params) {
    locationSearchParams = params;
}

function getLocationSearchParams() {
    return locationSearchParams;
}

module.exports = {
    setSearchType,
    getSearchType,
    setSearchPage,
    getSearchPage,
    setArtistSearchParams,
    getArtistSearchParams,
    setLocationSearchParams,
    getLocationSearchParams,
}