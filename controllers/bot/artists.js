const { getDates, askDates, sendMessageWithNext } = require('../utils/shared');
const constantsSearch = require('../../constants/constants-search');
const { constants } = require('../../constants/constants');
const bot = require('../../instances/bot');
const { getLanguage } = require('../../lang/instance');

const { 
    getEventsListTemplate, 
    getArtists, 
    getEventsByArtist,
} = require('../utils/utils');

const {
    setSearchType,
    getSearchType,
    setSearchPage,
    getSearchPage,
    setArtistSearchParams,
    getArtistSearchParams,
} = require('../utils/params');

bot.onText(/\/artists/, async msg => {
    setSearchType(constantsSearch.ARTISTS_SEARCH);
    setSearchPage(0);

    const artists  = await askArtist(msg.chat.id);
    const datesRes = await askDates(msg.chat.id);
    const dates = await getDates(datesRes, msg); 
    const { fromDate } = dates;
    const { toDate }   = dates;

    try {
        setSearchParams(artists, fromDate, toDate, msg.chat.id);
        await getNextEventsByArtist();
    } catch(e) {
        bot.sendMessage(msg.chat.id, getLanguage().BAND_NOT_FOUND, constants.REPLY_OPTIONS);
    }
});

async function askArtist(chatId) {
    bot.sendMessage(chatId, getLanguage().BAND, constants.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            const artists = await getArtists(reply.text);
            resolve(artists);
        });
    });
}

function setSearchParams(artists, fromDate, toDate, chatID) {
    const artist = artists.resultsPage.results.artist[0];
    bot.sendMessage(chatID, getLanguage().BAND_SEARCH(artist.displayName), constants.REPLY_OPTIONS);
    setArtistSearchParams({
        artist,
        fromDate,
        toDate,
        chatID
    });
}

async function getNextEventsByArtist() {
    const { artist, fromDate, toDate, chatID } = getArtistSearchParams();
    let searchPage = getSearchPage();
    searchPage++;
    setSearchPage(searchPage);

    const { eventsList, eventsCount } = await getEventsByArtist(artist, fromDate, toDate, searchPage);
    const message = !eventsCount ? getLanguage().EVENTS_NOT_FOUND : getLanguage().EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constants.REPLY_OPTIONS);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, artist, constantsSearch.ARTISTS_SEARCH);
    if (getSearchPage() * constantsSearch.EVENTS_PER_PAGE > eventsCount) {
        setArtistSearchParams(null);
        eventTpl += getLanguage().FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

bot.on('message', async msg => {
    const chatId = msg.chat.id;

    if (msg.text === getLanguage().NEXT) {
        if (getArtistSearchParams() && getSearchType() === constantsSearch.ARTISTS_SEARCH) {
            await getNextEventsByArtist();
        }
    }
});