import { IMessage } from '../constants/typings';
declare function log(msg: IMessage, event: string, params: any): Promise<void>;
export { log };
