const WELCOME = `Привет! 😄😉 
🎸 Для поиска концертов по названию группы набери /artists. 
🌎 Для поиска концертов по городу набери /locations.
🆘 Для просмотра списка возможных команд набери /help.`;

const COMMANDS = `Команды: 💬
/start
/artists - для поиска концертов по названию группы или имени артиста
/locations - для поиска концертов по разных городам
/setlang - для установки языка бота
/help`;

const SET_LANG = 'Выбери язык ;)';

const LANG_IS = lang => `Установлен ${lang} язык. Нажми /start`;

const BAND = "Круто, теперь введи название группы";

const BAND_SEARCH = band => `А теперь я поищу туры и концерты по группе ${band}...`;

const BAND_NOT_FOUND = 'Извини, по этой группе я ничего не нашел :(';

const LOCATION = "Круто, теперь введи название города в котором бдем искать концерты";

const LOCATION_SEARCH = location => `А теперь я поищу концерты в городе ${location}...`;

const LOCATION_NOT_FOUND = 'Извини, в этом городе я не нашел концертов :(';

const EVENTS_NOT_FOUND = 'Извини, похоже концертов нет :(';

const EVENTS_FOUND = count => `Я нашел ${count} концертов, я буду выдавать по 5 концертов в сообщении, чтобы перейти к следующим жми Next`;

const FINISHED = 'Это все! Чтобы начать новый поиск нажми /start';

const langRu = {
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
    FINISHED
}

module.exports = {
    langRu
}