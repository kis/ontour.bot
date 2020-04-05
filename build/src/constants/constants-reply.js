"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constantsLangs = require('./constants-langs');
const REPLY_OPTIONS = {
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "one_time_keyboard": true
    })
};
exports.REPLY_OPTIONS = REPLY_OPTIONS;
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
exports.REPLY_LOCATION = REPLY_LOCATION;
const KEYBOARD_NEXT_OPTIONS = (lang) => ({
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "keyboard": [
            [{ text: lang.NEXT }],
        ],
        "one_time_keyboard": true
    })
});
exports.KEYBOARD_NEXT_OPTIONS = KEYBOARD_NEXT_OPTIONS;
const KEYBOARD_LANGUAGE_OPTIONS = {
    "parse_mode": "html",
    "reply_markup": JSON.stringify({
        "keyboard": [
            [{ text: `🇺🇸 ${constantsLangs.LANG_EN}` }],
            [{ text: `🇷🇺 ${constantsLangs.LANG_RU}` }],
            [{ text: `🇫🇷 ${constantsLangs.LANG_FR}` }]
        ],
        "one_time_keyboard": true
    })
};
exports.KEYBOARD_LANGUAGE_OPTIONS = KEYBOARD_LANGUAGE_OPTIONS;
//# sourceMappingURL=constants-reply.js.map