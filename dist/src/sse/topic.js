'use strict';
/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
Object.defineProperty(exports, '__esModule', { value: true });
class Topic {
  constructor() {
    console.log(' constructor for Topic');
    this.connections = [];
  }
  static getInstance() {
    if (!Topic.instance) {
      Topic.instance = new Topic();
    }
    return Topic.instance;
  }
  add(conn) {
    const connections = this.connections;
    connections.push(conn);
    console.log('New client connected, now: ', connections.length);
    conn.res.on('close', () => {
      let i = connections.indexOf(conn);
      if (i >= 0) {
        connections.splice(i, 1);
      }
      console.log('Client disconnected, now: ', connections.length);
    });
  }
  forEach(cb) {
    this.connections.forEach(cb);
  }
}
const TopicInstance = Topic.getInstance();
exports.default = TopicInstance;
//# sourceMappingURL=topic.js.map
