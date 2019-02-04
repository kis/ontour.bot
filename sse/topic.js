/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
const Topic = (function () {
    function Topic() {
        console.log(" constructor for Topic");
        this.connections = [];
    }
    Topic.prototype.add = function (conn) {
        const connections = this.connections;
        connections.push(conn);
        console.log('New client connected, now: ', connections.length);
        conn.res.on('close', function () {
            let i = connections.indexOf(conn);
            if (i >= 0) {
                connections.splice(i, 1);
            }
            console.log('Client disconnected, now: ', connections.length);
        });
    };
    Topic.prototype.forEach = function (cb) {
        this.connections.forEach(cb);
    };
    return Topic;
}());

let TopicInstance = null;

if (!TopicInstance) {
    TopicInstance = new Topic();
}

module.exports = TopicInstance;