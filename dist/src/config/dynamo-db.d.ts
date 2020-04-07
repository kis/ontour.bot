import * as AWS from 'aws-sdk';
import { IMessage } from '../constants/typings';
declare function putData(
  msg: IMessage,
  event: string | number | any,
  params: any
): Promise<
  | import('aws-sdk/lib/request').PromiseResult<
      AWS.DynamoDB.PutItemOutput,
      AWS.AWSError
    >
  | undefined
>;
export { putData };
