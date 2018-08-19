module.exports = {
  apps : [{
    name      : 'ontour-bot',
    script    : './index.js',
    env: {
      NODE_ENV: 'development'
      TOKEN: '569579941:AAHGcWbmj9Fk1c7N5rDIE01EBOuHhOorit4'
    },
    env_production : {
      NODE_ENV: 'production'
    }
  }]
};
