'use strict';
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const AWS = __importStar(require('aws-sdk'));
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
async function putData(msg, event, params) {
  try {
    const item = {
      TableName: 'ontour_events',
      Item: {
        user_id: {
          S: String(msg.from.id),
        },
        chat_id: {
          S: String(msg.chat.id),
        },
        message_id: {
          S: String(msg.message_id),
        },
        name: {
          S: [msg.from.first_name, msg.from.last_name].join(' '),
        },
        username: {
          S: msg.from.username || 'Undefined',
        },
        createdAt: {
          S: String(msg.date),
        },
        event: {
          S: event,
        },
        params: {
          S: params,
        },
      },
    };
    console.log('put', item);
    const res = await dynamodb.putItem(item).promise();
    console.log('res', res);
    return res;
  } catch (error) {
    console.log('Error', error);
    return;
  }
}
exports.putData = putData;
//# sourceMappingURL=dynamo-db.js.map
