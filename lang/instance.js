const { langEn } = require('./lang-en');
const { langRu } = require('./lang-ru');
const { langFr } = require('./lang-fr');

const { constants } = require('../constants/constants');

let currentLanguage = langEn;

function setLanguage(lang) {
    switch(lang) {
        case constants.LANG_EN:
            currentLanguage = langEn;
            break;
        case constants.LANG_RU:
            currentLanguage = langRu;
            break;
        case constants.LANG_FR:
            currentLanguage = langFr;
            break;
        default:
            break;
    }

    return currentLanguage;
}

function getLanguage() {
    return currentLanguage;
}

module.exports = {
    setLanguage,
    getLanguage
}