const bot = require('../../instances/bot');
const constantsSearch = require('../../constants/constants-search');
const constantsReply = require('../../constants/constants-reply');
const { getLanguage } = require('../../lang/instance');
const { getDates, askDates, sendMessageWithNext } = require('../utils/shared');

const { log } = require('../../config/logger');
const constantsEvents = require('../../constants/constants-events');

const { 
    getEventsListTemplate, 
    getArtists, 
    getArtistImage,
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
        await setSearchParams(artists, fromDate, toDate, msg.chat.id);
        await getNextEventsByArtist();
    } catch(e) {
        bot.sendMessage(msg.chat.id, getLanguage().BAND_NOT_FOUND, constantsReply.REPLY_OPTIONS);
    }
});

async function askArtist(chatId) {
    bot.sendMessage(chatId, getLanguage().BAND, constantsReply.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            await log(reply, constantsEvents.EVENT_LOCATION_SEARCH, reply.text);
            const artists = await getArtists(reply.text);
            resolve(artists);
        });
    });
}

async function setSearchParams(artists, fromDate, toDate, chatID) {
    const artist = artists.resultsPage.results.artist[0];
    bot.sendMessage(chatID, getLanguage().BAND_SEARCH(artist.displayName), constantsReply.REPLY_OPTIONS);
    setArtistSearchParams({
        artist,
        fromDate,
        toDate,
        chatID
    });

    const artistImage = await getArtistImage(artist);
    bot.sendPhoto(chatID, artistImage, constantsReply.REPLY_OPTIONS);
}

async function getNextEventsByArtist() {
    const { artist, fromDate, toDate, chatID } = getArtistSearchParams();
    let searchPage = getSearchPage();
    searchPage++;
    setSearchPage(searchPage);

    const { eventsList, eventsCount } = await getEventsByArtist(artist, fromDate, toDate, searchPage);
    const message = !eventsCount ? getLanguage().EVENTS_NOT_FOUND : getLanguage().EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);

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