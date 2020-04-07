/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
interface conn {
    res: {
        on: (event: string, callback: () => void) => void;
    };
}
declare class Topic {
    connections: Array<any>;
    private static instance;
    private constructor();
    static getInstance(): Topic;
    add(conn: conn): void;
    forEach(cb: () => void): void;
}
declare const TopicInstance: Topic;
export default TopicInstance;
