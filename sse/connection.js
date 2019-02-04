/**
 * A Connection is a simple SSE manager for 1 client.
 */
const Connection = (function () {
    function Connection(res) {
        console.log(" sseMiddleware construct connection for response ");
        this.res = res;
    }
    Connection.prototype.setup = function () {
        console.log("set up SSE stream for response");
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    };
    Connection.prototype.send = function (data) {
        console.log("send event to SSE stream "+JSON.stringify(data));
        this.res.write("data: " + JSON.stringify(data) + "\n\n");
    };
    return Connection;
}());
 
module.exports = Connection;