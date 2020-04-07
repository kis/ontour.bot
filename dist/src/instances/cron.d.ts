interface MessageObj {
    artists: Array<string>;
    cities: Array<string>;
}
declare function createJob(chatId: number, messageObj: MessageObj): any;
export { createJob };
