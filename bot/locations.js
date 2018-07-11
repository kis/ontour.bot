const { getDates, askDates, sendMessageWithNext } = require('./shared');
const { constants } = require('../constants');
const bot = require('../bot');
const { getLanguage } = require('../lang/instance');

const { 
    getEventsListTemplate, 
    getMetroAreas,
    getEventsByMetroAreaID 
} = require('../utils');

const {
    setSearchType,
    getSearchType,
    setSearchPage,
    getSearchPage,
    setLocationSearchParams,
    getLocationSearchParams
} = require('./params');

bot.onText(/\/locations/, async msg => {
    setSearchType(constants.LOCATIONS_SEARCH);
    setSearchPage(0);

    const cities   = await askLocation(msg.chat.id);
    const datesRes = await askDates(msg.chat.id);
    const dates = await getDates(datesRes, msg); 
    const { fromDate } = dates;
    const { toDate }   = dates;

    try {
        setSearchParams(cities, fromDate, toDate, msg.chat.id);
        await getNextEventsByMetroAreaID();
    } catch(e) {
        bot.sendMessage(msg.chat.id, getLanguage().LOCATION_NOT_FOUND, constants.REPLY_OPTIONS);
    }
});

async function askLocation(chatId) {
    bot.sendMessage(chatId, getLanguage().LOCATION, constants.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async reply => {
            const cities = await getMetroAreas(reply.text);
            resolve(cities);
        });
    });
}

function setSearchParams(cities, fromDate, toDate, chatID) {
    const location = cities.resultsPage.results.location[0];
    const city = location.city;
    const metroAreaID = location.metroArea.id;
    bot.sendMessage(chatID, getLanguage().LOCATION_SEARCH(city.displayName), constants.REPLY_OPTIONS);
    setLocationSearchParams({
        metroAreaID,
        city,
        fromDate,
        toDate,
        chatID
    });
}

async function getNextEventsByMetroAreaID() {
    const { metroAreaID, city, fromDate, toDate, chatID } = getLocationSearchParams();
    let searchPage = getSearchPage();
    searchPage++;
    setSearchPage(searchPage);

    const { eventsList, eventsCount } = await getEventsByMetroAreaID(metroAreaID, fromDate, toDate, searchPage);
    const message = !eventsCount ? getLanguage().EVENTS_NOT_FOUND : getLanguage().EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constants.REPLY_OPTIONS);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, city, constants.LOCATIONS_SEARCH);
    if (getSearchPage() * constants.EVENTS_PER_PAGE > eventsCount) {
        setLocationSearchParams(null);
        eventTpl += getLanguage().FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

bot.on('message', async msg => {
    const chatId = msg.chat.id;

    if (msg.text === getLanguage().NEXT) {
        if (getLocationSearchParams() && getSearchType() === constants.LOCATIONS_SEARCH) { 
            await getNextEventsByMetroAreaID();
        }
    }
});