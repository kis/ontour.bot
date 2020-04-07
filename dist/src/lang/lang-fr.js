'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const WELCOME = (name) => `<b>Bonjour, ${name}!</b> 😄😉 \n\n
🎸 Pour rechercher des concerts par des groupes de musique entrez le /artists.
🌎 Pour rechercher des événements par ville entrez le /locations.
📌 Pour rechercher des événements par emplacement entrez le /mylocation.
🆘 Pour vérifier la liste des commandes disponibles entrez le /help.
🎓 Pour définir la langue du bot entrez le /setlang.`;
const COMMANDS = `<b>Commandes:</b> 💬
/start - démarrer le bot
/artists - recherche de concerts par groupes de musique
/locations - recherche d'événements par villes
/mylocation - rechercher des événements par emplacement
/setlang - définit la langue du bot
/help - obtenir de l'aide`;
const DATE_COMMANDS = `<b>Pour rechercher un concert par dates:</b> 💬
/today - montrer des concerts aujourd'hui
/next_week - montrer des concerts pour la semaine à venir
/next_month - montrer des concerts un mois à l'avance
/enter_dates - entrez la date de début et la date de fin

`;
const SET_LANG = 'Choisissez la langue ;)';
const LANG_IS = (lang) =>
  `Le langage Bot est défini sur ${lang}. Appuyez sur /start`;
const BAND = 'Cool, tape maintenant le nom du groupe';
const BAND_SEARCH = (band) => `Recherchons la tournée de ${band}...`;
const BAND_NOT_FOUND =
  "Désolé, je n'ai pas trouvé cet artiste :( Appuyez sur /start";
const LOCATION = 'Cool, tapez maintenant la ville';
const MY_LOCATION = 'Cool, où es-tu?';
const LOCATION_SEARCH = (location) =>
  `Recherchons les événements dans ${location}...`;
const LOCATION_NOT_FOUND =
  "Désolé, je n'ai pas trouvé une telle ville :( Appuyez sur /start";
const DATES_FROM =
  'Veuillez taper FROM DATE (YYYY-MM-DD) des concerts à rechercher, ou appuyez sur Suivant pour passer';
const DATES_TO =
  'Veuillez taper TO DATE (YYYY-MM-DD) des concerts à rechercher, ou appuyez sur Suivant pour ignorer';
const EVENTS_NOT_FOUND =
  "Je n'ai trouvé aucun concert, désolé :( Appuyez sur /start";
const EVENTS_FOUND = (count) =>
  `Found ${count} concerts, je vais grouper 5 par message, s'il vous plaît continuez avec tap sur Suivant`;
const FINISHED =
  'Terminé! Pour lancer une nouvelle recherche, appuyez sur /start';
const NEXT = 'Suivant';
const langFr = {
  SET_LANG,
  LANG_IS,
  WELCOME,
  COMMANDS,
  DATE_COMMANDS,
  BAND,
  BAND_SEARCH,
  BAND_NOT_FOUND,
  LOCATION,
  MY_LOCATION,
  LOCATION_SEARCH,
  LOCATION_NOT_FOUND,
  DATES_FROM,
  DATES_TO,
  EVENTS_NOT_FOUND,
  EVENTS_FOUND,
  FINISHED,
  NEXT,
};
exports.langFr = langFr;
//# sourceMappingURL=lang-fr.js.map
