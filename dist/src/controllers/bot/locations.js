'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const bot_1 = __importDefault(require('../../instances/bot'));
const constantsSearch = __importStar(
  require('../../constants/constants-search')
);
const constantsReply = __importStar(require('../../constants/constants-reply'));
const instance_1 = require('../../lang/instance');
const shared_1 = require('../utils/shared');
const logger_1 = require('../../config/logger');
const constantsEvents = __importStar(
  require('../../constants/constants-events')
);
const api_1 = require('../../api');
const utils_1 = require('../utils/utils');
const params_1 = require('../utils/params');
bot_1.default.onText(/\/locations/, async (msg) => {
  params_1.setSearchType(constantsSearch.LOCATIONS_SEARCH);
  params_1.setSearchPage(0);
  const cities = await askLocation(msg.chat.id);
  const datesRes = await shared_1.askDates(msg.chat.id);
  const dates = await shared_1.getDates(datesRes, msg);
  const { fromDate } = dates;
  const { toDate } = dates;
  try {
    setSearchParams(cities, fromDate, toDate, msg.chat.id);
    await getNextEventsByMetroAreaID();
  } catch (e) {
    bot_1.default.sendMessage(
      msg.chat.id,
      instance_1.getLanguage().LOCATION_NOT_FOUND,
      constantsReply.REPLY_OPTIONS
    );
  }
});
async function askLocation(chatId) {
  bot_1.default.sendMessage(
    chatId,
    instance_1.getLanguage().LOCATION,
    constantsReply.REPLY_OPTIONS
  );
  return await new Promise((resolve, reject) => {
    bot_1.default.once('message', async (reply) => {
      await logger_1.log(
        reply,
        constantsEvents.EVENT_LOCATION_SEARCH,
        reply.text
      );
      const cities = await utils_1.getMetroAreas(reply.text);
      resolve(cities);
    });
  });
}
function setSearchParams(cities, fromDate, toDate, chatID) {
  const location = cities.resultsPage.results.location[0];
  const city = location.city;
  const metroAreaID = location.metroArea.id;
  bot_1.default.sendMessage(
    chatID,
    instance_1.getLanguage().LOCATION_SEARCH(city.displayName),
    constantsReply.REPLY_OPTIONS
  );
  params_1.setLocationSearchParams({
    metroAreaID,
    city,
    fromDate,
    toDate,
    chatID,
  });
}
async function getNextEventsByMetroAreaID() {
  const {
    metroAreaID,
    city,
    fromDate,
    toDate,
    chatID,
  } = params_1.getLocationSearchParams();
  let searchPage = params_1.getSearchPage();
  searchPage++;
  params_1.setSearchPage(searchPage);
  const { eventsList, eventsCount } = await utils_1.getEventsByMetroAreaID(
    metroAreaID,
    fromDate,
    toDate,
    searchPage
  );
  const message = !eventsCount
    ? instance_1.getLanguage().EVENTS_NOT_FOUND
    : instance_1.getLanguage().EVENTS_FOUND(eventsCount);
  bot_1.default.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);
  if (!eventsList.event || !eventsList.event.length) return;
  let eventTpl = utils_1.getEventsListTemplate(
    eventsList,
    city,
    constantsSearch.LOCATIONS_SEARCH
  );
  if (
    params_1.getSearchPage() * constantsSearch.EVENTS_PER_PAGE >
    eventsCount
  ) {
    params_1.setLocationSearchParams(null);
    eventTpl += instance_1.getLanguage().FINISHED;
  }
  shared_1.sendMessageWithNext(chatID, eventTpl);
}
bot_1.default.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === instance_1.getLanguage().NEXT) {
    if (
      params_1.getLocationSearchParams() &&
      params_1.getSearchType() === constantsSearch.LOCATIONS_SEARCH
    ) {
      await getNextEventsByMetroAreaID();
    }
  }
});
bot_1.default.onText(/\/mylocation/, async (msg) => {
  params_1.setSearchType(constantsSearch.LOCATIONS_SEARCH);
  params_1.setSearchPage(0);
  const location = await askMyLocation(msg.chat.id);
  const cities = await api_1.fetchLocationsByCoords(location);
  const citiesRes = JSON.parse(cities.text);
  const citiesArray = citiesRes.resultsPage.results.location;
  await logger_1.log(msg, constantsEvents.EVENT_MY_LOCATION, citiesArray);
  bot_1.default.sendMessage(
    msg.chat.id,
    utils_1.getCitiesTemplate(citiesArray),
    constantsReply.REPLY_OPTIONS
  );
});
async function askMyLocation(chatId) {
  bot_1.default.sendMessage(
    chatId,
    instance_1.getLanguage().MY_LOCATION,
    constantsReply.REPLY_LOCATION
  );
  return await new Promise((resolve, reject) => {
    bot_1.default.once('location', async (reply) => {
      await logger_1.log(
        reply,
        constantsEvents.EVENT_MY_LOCATION,
        reply.location
      );
      bot_1.default.sendMessage(
        reply.chat.id,
        'Your location is ' +
          [reply.location.longitude, reply.location.latitude].join(';')
      );
      resolve(reply.location);
    });
  });
}
//# sourceMappingURL=locations.js.map
