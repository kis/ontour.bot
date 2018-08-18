console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

require('./controllers/bot/start');
require('./controllers/bot/help');
require('./controllers/bot/setlang');
require('./controllers/bot/artists');
require('./controllers/bot/locations');