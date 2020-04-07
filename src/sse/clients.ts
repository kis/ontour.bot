import TopicInstance from './topic';
import { IClientData } from '../constants/typings';

export default function updateSseClients(message: IClientData) {
  TopicInstance.connections.forEach((sseConnection: any) => {
    sseConnection.send(message);
  });
}
