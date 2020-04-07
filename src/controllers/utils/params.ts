let searchType: any = null;
let searchPage = 0;
let artistSearchParams: any = null;
let locationSearchParams: any = null;

function setSearchType(type: string) {
  searchType = type;
}

function getSearchType() {
  return searchType;
}

function setSearchPage(page: number) {
  searchPage = page;
}

function getSearchPage() {
  return searchPage;
}

function setArtistSearchParams(params: any) {
  artistSearchParams = params;
}

function getArtistSearchParams() {
  return artistSearchParams;
}

function setLocationSearchParams(params: any) {
  locationSearchParams = params;
}

function getLocationSearchParams() {
  return locationSearchParams;
}

export {
  setSearchType,
  getSearchType,
  setSearchPage,
  getSearchPage,
  setArtistSearchParams,
  getArtistSearchParams,
  setLocationSearchParams,
  getLocationSearchParams,
};
