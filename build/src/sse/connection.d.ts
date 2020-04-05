/**
 * A Connection is a simple SSE manager for 1 client.
 */
export default class Connection {
    res?: any;
    constructor(res: any);
    setup(): void;
    send(data: any): void;
}
