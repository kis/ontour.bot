"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let searchType = null;
let searchPage = 0;
let artistSearchParams = null;
let locationSearchParams = null;
function setSearchType(type) {
    searchType = type;
}
exports.setSearchType = setSearchType;
function getSearchType() {
    return searchType;
}
exports.getSearchType = getSearchType;
function setSearchPage(page) {
    searchPage = page;
}
exports.setSearchPage = setSearchPage;
function getSearchPage() {
    return searchPage;
}
exports.getSearchPage = getSearchPage;
function setArtistSearchParams(params) {
    artistSearchParams = params;
}
exports.setArtistSearchParams = setArtistSearchParams;
function getArtistSearchParams() {
    return artistSearchParams;
}
exports.getArtistSearchParams = getArtistSearchParams;
function setLocationSearchParams(params) {
    locationSearchParams = params;
}
exports.setLocationSearchParams = setLocationSearchParams;
function getLocationSearchParams() {
    return locationSearchParams;
}
exports.getLocationSearchParams = getLocationSearchParams;
//# sourceMappingURL=params.js.map