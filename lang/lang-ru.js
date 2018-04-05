const WELCOME = name => `Привет, ${name}! 😄😉 
🎸 Для поиска концертов по названию группы набери /artists. 
🌎 Для поиска концертов по городу набери /locations.
🆘 Для просмотра списка возможных команд набери /help.
🎓 Для выбора языка набери /setlang.`;

const COMMANDS = `Команды: 💬
/start - начать общение с ботом
/artists - для поиска концертов по названию группы или имени артиста
/locations - для поиска концертов по разных городам
/setlang - для установки языка бота
/help - помощь`;

const SET_LANG = 'Выбери язык ;)';

const LANG_IS = lang => `Установлен ${lang} язык. Нажми /start`;

const BAND = "Круто, теперь введи название группы";

const BAND_SEARCH = band => `А теперь я поищу туры и концерты по группе ${band}...`;

const BAND_NOT_FOUND = 'Извини, по этой группе я ничего не нашел :(';

const LOCATION = "Круто, теперь введи название города, в котором будем искать концерты";

const LOCATION_SEARCH = location => `А теперь я поищу концерты в городе ${location}...`;

const LOCATION_NOT_FOUND = 'Извини, в этом городе я не нашел концертов :(';

const DATES_FROM = 'Пожалуйста, введи дату (в формате YYYY-MM-DD), с которой начать поиск концертов, или нажми Далее';

const DATES_TO = 'Пожалуйста, теперь введи дату (в формате YYYY-MM-DD), до которой начать поиск концертов, или нажми Далее';

const EVENTS_NOT_FOUND = 'Извини, похоже концертов нет :(';

const EVENTS_FOUND = count => `Я нашел ${count} концертов, я буду выдавать по 5 концертов в сообщении, чтобы перейти к следующим жми Далее`;

const FINISHED = 'Это все! Чтобы начать новый поиск нажми /start';

const NEXT = 'Далее';

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
    DATES_FROM,
    DATES_TO,
    EVENTS_NOT_FOUND,
    EVENTS_FOUND,
    FINISHED,
    NEXT
}

module.exports = {
    langRu
}