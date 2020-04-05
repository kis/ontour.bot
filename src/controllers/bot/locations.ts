import bot from '../../instances/bot'
import * as constantsSearch from '../../constants/constants-search'
import * as constantsReply from '../../constants/constants-reply'
import { getLanguage } from '../../lang/instance'
import { getDates, askDates, sendMessageWithNext } from '../utils/shared'
import { log } from '../../config/logger'
import * as constantsEvents from '../../constants/constants-events'

import { 
    fetchLocationsByCoords 
} from '../../api'

import { 
    getEventsListTemplate, 
    getCitiesTemplate,
    getMetroAreas,
    getEventsByMetroAreaID 
} from '../utils/utils'

import {
    setSearchType,
    getSearchType,
    setSearchPage,
    getSearchPage,
    setLocationSearchParams,
    getLocationSearchParams
} from '../utils/params'

bot.onText(/\/locations/, async (msg: any) => {
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

async function askLocation(chatId: number) {
    bot.sendMessage(chatId, getLanguage().LOCATION, constantsReply.REPLY_OPTIONS);
    return await new Promise((resolve, reject) => {
        bot.once("message", async (reply: any) => {
            await log(reply, constantsEvents.EVENT_LOCATION_SEARCH, reply.text);
            const cities = await getMetroAreas(reply.text);
            resolve(cities);
        });
    });
}

function setSearchParams(cities: any, fromDate: any, toDate: any, chatID: number) {
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

bot.on('message', async (msg: any) => {
    const chatId = msg.chat.id;

    if (msg.text === getLanguage().NEXT) {
        if (getLocationSearchParams() && getSearchType() === constantsSearch.LOCATIONS_SEARCH) { 
            await getNextEventsByMetroAreaID();
        }
    }
});

bot.onText(/\/mylocation/, async (msg: any) => {
    setSearchType(constantsSearch.LOCATIONS_SEARCH);
    setSearchPage(0);

    const location: any = await askMyLocation(msg.chat.id);
    const cities = await fetchLocationsByCoords(location);
    const citiesRes = JSON.parse(cities.text);
    const citiesArray = citiesRes.resultsPage.results.location;
    await log(msg, constantsEvents.EVENT_MY_LOCATION, citiesArray);

    bot.sendMessage(msg.chat.id, getCitiesTemplate(citiesArray), constantsReply.REPLY_OPTIONS);
});

async function askMyLocation(chatId: number) {
    bot.sendMessage(chatId, getLanguage().MY_LOCATION, constantsReply.REPLY_LOCATION);
    return await new Promise((resolve, reject) => {
        bot.once("location", async (reply: any) => {
            await log(reply, constantsEvents.EVENT_MY_LOCATION, reply.location);
            bot.sendMessage(reply.chat.id, "Your location is " + [reply.location.longitude, reply.location.latitude].join(";"));
            resolve(reply.location);
        });
    });
}