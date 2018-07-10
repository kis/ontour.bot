const WELCOME = name => `Welcome, ${name}! 😄😉 
🎸 To search concerts by music bands type /artists.
🌎 To search events by cities type /locations.
🆘 To check the list of available command type /help.
🎓 To set bot language type /setlang.`;

const COMMANDS = `Commands: 💬
/start - start bot
/artists - search concerts by music bands
/locations - search events by cities
/setlang - set bot language
/help - get help`;

const DATE_COMMANDS = `For searching concerts by dates: 💬
/today - show only today concerts
/next_week - show only next week concerts
/next_month - show only next month concerts
/enter_dates - enter start date and end date`;

const SET_LANG = 'Choose the language ;)';

const LANG_IS = lang => `Bot language setted to ${lang}. Press /start`;

const BAND = "Cool, now type the name of the band";

const BAND_SEARCH = band => `Let's search for ${band}'s tour...`;

const BAND_NOT_FOUND = 'Sorry, I haven\'t found such artist :(';

const LOCATION = "Cool, now type the city";

const LOCATION_SEARCH = location => `Let's search for events in ${location}...`;

const LOCATION_NOT_FOUND = 'Sorry, I haven\'t found such city :(';

const DATES_FROM = 'Please type FROM DATE (YYYY-MM-DD) of the concerts to search, or press Next to skip';

const DATES_TO = 'Please type TO DATE (YYYY-MM-DD) of the concerts to search, or press Next to skip';

const EVENTS_NOT_FOUND = 'I haven\'t found any concerts, sorry :(';

const EVENTS_FOUND = count => `Found ${count} concerts, I will group it 5 per message, please continue with tap on Next`;

const FINISHED = 'Finished! To start new search tap /start';

const NEXT = 'Next';

const langEn = {
    SET_LANG,
    LANG_IS,
    WELCOME,
    COMMANDS,
    DATE_COMMANDS,
    BAND,
    BAND_SEARCH,
    BAND_NOT_FOUND,
    LOCATION,
    LOCATION_SEARCH,
    LOCATION_NOT_FOUND,
    DATES_FROM,
    DATES_TO,
    EVENTS_NOT_FOUND,
    EVENTS_FOUND,
    FINISHED,
    NEXT
}

module.exports = {
    langEn
}