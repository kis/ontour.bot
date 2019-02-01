const TopicInstance = require('./topic');

console.log('TopicInstance', TopicInstance);

var m;

//send message to all registered SSE clients
const updateSseClients = function(message) {
  var msg = message;
  this.m=message;
  TopicInstance.connections.forEach( 
    function(sseConnection) {
      sseConnection.send(this.m); 
    }
    , this // this second argument to forEach is the thisArg (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 
  ); //forEach
}// updateSseClients

// send a heartbeat signal to all SSE clients, once every interval seconds (or every 3 seconds if no interval is specified)
const initHeartbeat = function(interval) {
  setInterval(function()  {
      var msg = {"label":"The latest", "time":new Date()}; 
      updateSseClients( JSON.stringify(msg));
    }//interval function
  , interval?interval*1000:3000
  ); // setInterval 
}//initHeartbeat

module.exports = {
  initHeartbeat,
  updateSseClients
};
