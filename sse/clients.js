const TopicInstance = require('./topic');
const m;

const updateSseClients = function(message) {
  const msg = message;
  this.m = message;
  TopicInstance.connections.forEach(sseConnection => {
    sseConnection.send(this.m);
  }, this);
}

module.exports = {
  updateSseClients
};
