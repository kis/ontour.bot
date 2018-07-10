const API_KEY = 'iOAsnWYdLjjhNvvM';

const ITEMS_PER_PAGE = 1;
const EVENTS_PER_PAGE = 5;

const ARTISTS_SEARCH = 'artists';
const LOCATIONS_SEARCH = 'location';

const LANG_EN = 'English';
const LANG_RU = 'Russian';
const LANG_FR = 'French';

const REPLY_OPTIONS = { 
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "one_time_keyboard": true
    })
};

const KEYBOARD_NEXT_OPTIONS = lang => ({ 
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "keyboard": [
            [{text: lang.NEXT}],
        ],
        "one_time_keyboard": true
    })
});

const KEYBOARD_LANGUAGE_OPTIONS = { 
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "keyboard": [
            [{text: `🇺🇸 ${LANG_EN}`}],
            [{text: `🇷🇺 ${LANG_RU}`}],
            [{text: `🇫🇷 ${LANG_FR}`}]
        ],
        "one_time_keyboard": true
    }) 
};

const constants = {
    API_KEY,
    ITEMS_PER_PAGE,
    EVENTS_PER_PAGE,
    ARTISTS_SEARCH,
    LOCATIONS_SEARCH,
    LANG_EN,
    LANG_RU,
    LANG_FR,
    KEYBOARD_LANGUAGE_OPTIONS,
    KEYBOARD_NEXT_OPTIONS,
    REPLY_OPTIONS
};

module.exports = {
    constants
}