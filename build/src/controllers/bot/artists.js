"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("../../instances/bot"));
const constantsSearch = __importStar(require("../../constants/constants-search"));
const constantsReply = __importStar(require("../../constants/constants-reply"));
const instance_1 = require("../../lang/instance");
const shared_1 = require("../utils/shared");
const logger_1 = require("../../config/logger");
const constantsEvents = __importStar(require("../../constants/constants-events"));
const utils_1 = require("../utils/utils");
const params_1 = require("../utils/params");
bot_1.default.onText(/\/artists/, async (msg) => {
    params_1.setSearchType(constantsSearch.ARTISTS_SEARCH);
    params_1.setSearchPage(0);
    const artists = await askArtist(msg.chat.id);
    const datesRes = await shared_1.askDates(msg.chat.id);
    const dates = await shared_1.getDates(datesRes, msg);
    const { fromDate } = dates;
    const { toDate } = dates;
    try {
        await setSearchParams(artists, fromDate, toDate, msg.chat.id);
        await getNextEventsByArtist();
    }
    catch (e) {
        bot_1.default.sendMessage(msg.chat.id, instance_1.getLanguage().BAND_NOT_FOUND, constantsReply.REPLY_OPTIONS);
    }
});
async function askArtist(chatId) {
    bot_1.default.sendMessage(chatId, instance_1.getLanguage().BAND, constantsReply.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot_1.default.once("message", async (reply) => {
            await logger_1.log(reply, constantsEvents.EVENT_ARTIST_SEARCH, reply.text);
            const artists = await utils_1.getArtists(reply.text);
            resolve(artists);
        });
    });
}
async function setSearchParams(artists, fromDate, toDate, chatID) {
    const artist = artists.resultsPage.results.artist[0];
    bot_1.default.sendMessage(chatID, instance_1.getLanguage().BAND_SEARCH(artist.displayName), constantsReply.REPLY_OPTIONS);
    params_1.setArtistSearchParams({
        artist,
        fromDate,
        toDate,
        chatID
    });
    const artistImage = await utils_1.getArtistImage(artist);
    bot_1.default.sendPhoto(chatID, artistImage, constantsReply.REPLY_OPTIONS);
}
async function getNextEventsByArtist() {
    const { artist, fromDate, toDate, chatID } = params_1.getArtistSearchParams();
    let searchPage = params_1.getSearchPage();
    searchPage++;
    params_1.setSearchPage(searchPage);
    const { eventsList, eventsCount } = await utils_1.getEventsByArtist(artist, fromDate, toDate, searchPage);
    const similarTpl = await utils_1.getSimilarArtistsTemplate(artist.displayName);
    let message;
    if (!eventsCount) {
        message = instance_1.getLanguage().EVENTS_NOT_FOUND;
        bot_1.default.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);
        if (similarTpl)
            bot_1.default.sendMessage(chatID, similarTpl, constantsReply.REPLY_OPTIONS);
    }
    else {
        message = instance_1.getLanguage().EVENTS_FOUND(eventsCount);
        bot_1.default.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);
    }
    if (!eventsList.event || !eventsList.event.length)
        return;
    let eventTpl = utils_1.getEventsListTemplate(eventsList, artist, constantsSearch.ARTISTS_SEARCH);
    if (params_1.getSearchPage() * constantsSearch.EVENTS_PER_PAGE > eventsCount) {
        params_1.setArtistSearchParams(null);
        eventTpl += instance_1.getLanguage().FINISHED;
        shared_1.sendMessageWithNext(chatID, eventTpl);
        shared_1.sendMessageWithNext(chatID, similarTpl);
    }
    else {
        shared_1.sendMessageWithNext(chatID, eventTpl);
    }
}
bot_1.default.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === instance_1.getLanguage().NEXT) {
        if (params_1.getArtistSearchParams() && params_1.getSearchType() === constantsSearch.ARTISTS_SEARCH) {
            await getNextEventsByArtist();
        }
    }
});
//# sourceMappingURL=artists.js.map