'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const lang_en_1 = require('./lang-en');
const lang_ru_1 = require('./lang-ru');
const lang_fr_1 = require('./lang-fr');
const constantsLangs = require('../constants/constants-langs');
let currentLanguage = lang_en_1.langEn;
function setLanguage(lang) {
  switch (lang) {
    case constantsLangs.LANG_EN:
      currentLanguage = lang_en_1.langEn;
      break;
    case constantsLangs.LANG_RU:
      currentLanguage = lang_ru_1.langRu;
      break;
    case constantsLangs.LANG_FR:
      currentLanguage = lang_fr_1.langFr;
      break;
    default:
      break;
  }
  return currentLanguage;
}
exports.setLanguage = setLanguage;
function getLanguage() {
  return currentLanguage;
}
exports.getLanguage = getLanguage;
//# sourceMappingURL=instance.js.map
