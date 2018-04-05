const WELCOME = name => `Welcome, ${name}! 😄😉 
🎸 To search concerts by artists type /artists.
🌎 To search events in different cities type /locations.
🆘 To check the list of available command type /help.
🎓 To set bot language type /setlang.`;

const COMMANDS = `Commands: 💬
/start - start bot
/artists - search concerts by artists and bands
/locations - search events in different cities
/setlang - set bot language
/help - get help`;

const SET_LANG = 'Choose the language ;)';

const LANG_IS = lang => `Bot language set to ${lang}. Press /start`;

const BAND = "Cool, now type the name of the band";

const BAND_SEARCH = band => `Let's search for ${band}'s tour...`;

const BAND_NOT_FOUND = 'Sorry, I haven\'t found such artist :(';

const LOCATION = "Cool, now type the city";

const LOCATION_SEARCH = location => `Let's search for events in ${location}...`;

const LOCATION_NOT_FOUND = 'Sorry, I haven\'t found such city :(';

const EVENTS_NOT_FOUND = 'I haven\'t found any concerts, sorry :(';

const EVENTS_FOUND = count => `Found ${count} concerts, I will group it 5 per message, please continue with tap on Next`;

const FINISHED = 'Finished! To start new search tap /start';

const NEXT = 'Next';

const langEn = {
    SET_LANG,
    LANG_IS,
    WELCOME,
    COMMANDS,
    BAND,
    BAND_SEARCH,
    BAND_NOT_FOUND,
    LOCATION,
    LOCATION_SEARCH,
    LOCATION_NOT_FOUND,
    EVENTS_NOT_FOUND,
    EVENTS_FOUND,
    FINISHED,
    NEXT
}

module.exports = {
    langEn
}