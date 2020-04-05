/**
 * A Connection is a simple SSE manager for 1 client.
 */

export default class Connection {
    res?: any;
    
    constructor(res: any) {
        console.log(" sseMiddleware construct connection for response ");
        this.res = res;
    }

    setup() {
        console.log("set up SSE stream for response");
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    }

    send(data: any) {
        console.log("send event to SSE stream "+JSON.stringify(data));
        this.res.write("data: " + JSON.stringify(data) + "\n\n");
    }
}