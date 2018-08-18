const { langEn } = require('./lang-en');
const { langRu } = require('./lang-ru');
const { langFr } = require('./lang-fr');

const constantsLangs = require('../constants/constants-langs');

let currentLanguage = langEn;

function setLanguage(lang) {
    switch(lang) {
        case constantsLangs.LANG_EN:
            currentLanguage = langEn;
            break;
        case constantsLangs.LANG_RU:
            currentLanguage = langRu;
            break;
        case constantsLangs.LANG_FR:
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