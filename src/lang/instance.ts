import { langEn } from './lang-en';
import { langRu } from './lang-ru';
import { langFr } from './lang-fr';

const constantsLangs = require('../constants/constants-langs');

let currentLanguage = langEn;

function setLanguage(lang: string) {
  switch (lang) {
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

export { setLanguage, getLanguage };
