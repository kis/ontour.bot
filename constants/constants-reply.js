const constantsLangs = require('./constants-langs');

const REPLY_OPTIONS = { 
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "one_time_keyboard": true
    })
};

const REPLY_LOCATION = { 
    "parse_mode": "Markdown",
    "reply_markup": {
        "one_time_keyboard": true,
        "keyboard": [[{
            text: "My location",
            request_location: true
        }], ["Cancel"]]
    }
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
            [{text: `🇺🇸 ${constantsLangs.LANG_EN}`}],
            [{text: `🇷🇺 ${constantsLangs.LANG_RU}`}],
            [{text: `🇫🇷 ${constantsLangs.LANG_FR}`}]
        ],
        "one_time_keyboard": true
    }) 
};

module.exports = {
    KEYBOARD_LANGUAGE_OPTIONS,
    KEYBOARD_NEXT_OPTIONS,
    REPLY_OPTIONS,
    REPLY_LOCATION
}