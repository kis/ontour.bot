const { getDates, askDates, sendMessageWithNext } = require('../utils/shared');
const constantsSearch = require('../../constants/constants-search');
const constantsReply = require('../../constants/constants-reply');
const bot = require('../../instances/bot');
const { getLanguage } = require('../../lang/instance');

const { 
    getEventsListTemplate, 
    getMetroAreas,
    getEventsByMetroAreaID 
} = require('../utils/utils');

const {
    setSearchType,
    getSearchType,
    setSearchPage,
    getSearchPage,
    setLocationSearchParams,
    getLocationSearchParams
} = require('../utils/params');

bot.onText(/\/locations/, async msg => {
    setSearchType(constantsSearch.LOCATIONS_SEARCH);
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
        bot.sendMessage(msg.chat.id, getLanguage().LOCATION_NOT_FOUND, constantsReply.REPLY_OPTIONS);
    }
});

async function askLocation(chatId) {
    bot.sendMessage(chatId, getLanguage().LOCATION, constantsReply.REPLY_OPTIONS);
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
    bot.sendMessage(chatID, getLanguage().LOCATION_SEARCH(city.displayName), constantsReply.REPLY_OPTIONS);
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
    bot.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);

    if (!eventsList.event || !eventsList.event.length) return;

    let eventTpl = getEventsListTemplate(eventsList, city, constantsSearch.LOCATIONS_SEARCH);
    if (getSearchPage() * constantsSearch.EVENTS_PER_PAGE > eventsCount) {
        setLocationSearchParams(null);
        eventTpl += getLanguage().FINISHED;
    }
    sendMessageWithNext(chatID, eventTpl);
}

bot.on('message', async msg => {
    const chatId = msg.chat.id;

    if (msg.text === getLanguage().NEXT) {
        if (getLocationSearchParams() && getSearchType() === constantsSearch.LOCATIONS_SEARCH) { 
            await getNextEventsByMetroAreaID();
        }
    }
});

bot.onText(/\/mylocation/, async msg => {
    setSearchType(constantsSearch.LOCATIONS_SEARCH);
    setSearchPage(0);

    const cities   = await askMyLocation(msg.chat.id);
});

async function askMyLocation(chatId) {
    bot.sendMessage(chatId, getLanguage().MY_LOCATION, constantsReply.REPLY_LOCATION);
    return await new Promise((resolve, reject) => {
        bot.once("location", async reply => {
            bot.sendMessage(reply.chat.id, "Your location is " + [reply.location.longitude, reply.location.latitude].join(";"));
        });
    });
}