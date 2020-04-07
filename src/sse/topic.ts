/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */

interface conn {
  res: {
    on: (event: string, callback: () => void) => void;
  };
}

class Topic {
  public connections: Array<any>;
  private static instance: Topic;

  private constructor() {
    console.log(' constructor for Topic');
    this.connections = [];
  }

  static getInstance() {
    if (!Topic.instance) {
      Topic.instance = new Topic();
    }

    return Topic.instance;
  }

  public add(conn: conn) {
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

  public forEach(cb: () => void) {
    this.connections.forEach(cb);
  }
}

const TopicInstance = Topic.getInstance();

export default TopicInstance;
