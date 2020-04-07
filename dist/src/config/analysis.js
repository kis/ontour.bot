'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
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
const lodash_1 = __importDefault(require('lodash'));
const AWS = __importStar(require('aws-sdk'));
const constantsEvents = __importStar(require('../constants/constants-events'));
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
const docClient = new AWS.DynamoDB.DocumentClient();
async function startAnalysis(userId) {
  try {
    console.log('start analysis by userId', userId);
    const params = {
      TableName: 'ontour_events',
      KeyConditionExpression: '#user_id = :user_id',
      ExpressionAttributeNames: {
        '#user_id': 'user_id',
      },
      ExpressionAttributeValues: {
        ':user_id': String(userId),
      },
    };
    const data = await docClient.query(params).promise();
    const artists = lodash_1.default
      .chain(data.Items)
      .sortBy((item) => item.params)
      .filter((item) => item.event === constantsEvents.EVENT_ARTIST_SEARCH)
      .map((item) => lodash_1.default.capitalize(item.params))
      .uniqWith((a, b) => {
        return lodash_1.default.lowerCase(a) == lodash_1.default.lowerCase(b);
      })
      .value();
    console.log('Searched artists', artists);
    const cities = lodash_1.default
      .chain(data.Items)
      .sortBy((item) => item.params)
      .filter((item) => item.event === constantsEvents.EVENT_LOCATION_SEARCH)
      .map((item) => lodash_1.default.capitalize(item.params))
      .uniqWith((a, b) => {
        return lodash_1.default.lowerCase(a) == lodash_1.default.lowerCase(b);
      })
      .value();
    console.log('Searched cities', cities);
    const artistsStr = lodash_1.default.join(artists, ', ');
    const citiesStr = lodash_1.default.join(cities, ', ');
    const artistsItem = {
      TableName: 'top_artists',
      Item: {
        user_id: {
          S: String(userId),
        },
        top_artists: {
          S: String(artistsStr),
        },
      },
    };
    console.log('put artists', artistsItem);
    artistsStr && (await dynamodb.putItem(artistsItem).promise());
    const citiesItem = {
      TableName: 'top_cities',
      Item: {
        user_id: {
          S: String(userId),
        },
        top_cities: {
          S: String(citiesStr),
        },
      },
    };
    console.log('put cities', citiesItem);
    citiesStr && (await dynamodb.putItem(citiesItem).promise());
    return {
      artists,
      cities,
    };
  } catch (error) {
    console.log('Error', error);
    return;
  }
}
exports.startAnalysis = startAnalysis;
//# sourceMappingURL=analysis.js.map
