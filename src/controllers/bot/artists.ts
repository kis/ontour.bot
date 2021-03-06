import bot from '../../instances/bot';
import * as constantsSearch from '../../constants/constants-search';
import * as constantsReply from '../../constants/constants-reply';
import { getLanguage } from '../../lang/instance';
import { getDates, askDates, sendMessageWithNext } from '../utils/shared';
import { log } from '../../config/logger';
import * as constantsEvents from '../../constants/constants-events';
import { Message } from 'node-telegram-bot-api';

import {
  getEventsListTemplate,
  getArtists,
  getArtistImage,
  getEventsByArtist,
  getSimilarArtistsTemplate,
} from '../utils/utils';

import {
  setSearchType,
  getSearchType,
  setSearchPage,
  getSearchPage,
  setArtistSearchParams,
  getArtistSearchParams,
} from '../utils/params';

bot.onText(/\/artists/, async (msg: Message) => {
  setSearchType(constantsSearch.ARTISTS_SEARCH);
  setSearchPage(0);

  const artists = await askArtist(msg.chat.id);
  const datesRes = await askDates(msg.chat.id);
  const dates = await getDates(datesRes, msg);
  const { fromDate } = dates;
  const { toDate } = dates;

  try {
    await setSearchParams(artists, fromDate, toDate, msg.chat.id);
    await getNextEventsByArtist();
  } catch (e) {
    bot.sendMessage(
      msg.chat.id,
      getLanguage().BAND_NOT_FOUND,
      constantsReply.REPLY_OPTIONS
    );
  }
});

async function askArtist(chatId: number) {
  bot.sendMessage(chatId, getLanguage().BAND, constantsReply.REPLY_OPTIONS);
  return await new Promise((resolve, reject) => {
    bot.once('message', async (reply: any) => {
      await log(reply, constantsEvents.EVENT_ARTIST_SEARCH, reply.text);
      const artists = await getArtists(reply.text);
      resolve(artists);
    });
  });
}

async function setSearchParams(
  artists: any,
  fromDate: any,
  toDate: any,
  chatID: number
) {
  const artist = artists.resultsPage.results.artist[0];
  bot.sendMessage(
    chatID,
    getLanguage().BAND_SEARCH(artist.displayName),
    constantsReply.REPLY_OPTIONS
  );
  setArtistSearchParams({
    artist,
    fromDate,
    toDate,
    chatID,
  });

  const artistImage = await getArtistImage(artist);
  bot.sendPhoto(chatID, artistImage, constantsReply.REPLY_OPTIONS);
}

async function getNextEventsByArtist() {
  const { artist, fromDate, toDate, chatID } = getArtistSearchParams();
  let searchPage = getSearchPage();
  searchPage++;
  setSearchPage(searchPage);

  const { eventsList, eventsCount } = await getEventsByArtist(
    artist,
    fromDate,
    toDate,
    searchPage
  );
  const similarTpl = await getSimilarArtistsTemplate(artist.displayName);
  let message;

  if (!eventsCount) {
    message = getLanguage().EVENTS_NOT_FOUND;
    bot.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);
    if (similarTpl)
      bot.sendMessage(chatID, similarTpl, constantsReply.REPLY_OPTIONS);
  } else {
    message = getLanguage().EVENTS_FOUND(eventsCount);
    bot.sendMessage(chatID, message, constantsReply.REPLY_OPTIONS);
  }

  if (!eventsList.event || !eventsList.event.length) return;

  let eventTpl = getEventsListTemplate(
    eventsList,
    artist,
    constantsSearch.ARTISTS_SEARCH
  );
  if (getSearchPage() * constantsSearch.EVENTS_PER_PAGE > eventsCount) {
    setArtistSearchParams(null);
    eventTpl += getLanguage().FINISHED;
    sendMessageWithNext(chatID, eventTpl);
    sendMessageWithNext(chatID, similarTpl);
  } else {
    sendMessageWithNext(chatID, eventTpl);
  }
}

bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;

  if (msg.text === getLanguage().NEXT) {
    if (
      getArtistSearchParams() &&
      getSearchType() === constantsSearch.ARTISTS_SEARCH
    ) {
      await getNextEventsByArtist();
    }
  }
});
