const uuid = require('uuid');
const _ = require('lodash');
const AWS = require('aws-sdk');
const constantsEvents = require('../constants/constants-events');
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
const docClient = new AWS.DynamoDB.DocumentClient();

async function startAnalysis(userId) {
    try {
        console.log('start analysis by userId', userId);

        const params = {
            TableName: 'ontour_events',
            KeyConditionExpression: "#user_id = :user_id",
            ExpressionAttributeNames: {
                "#user_id": "user_id"
            },
            ExpressionAttributeValues: {
                ":user_id": String(userId)
            }
        };

        const data = await docClient.query(params).promise();

        const artists = _.chain(data.Items)
            .sortBy(item => item.params)
            .filter(item => item.event === constantsEvents.EVENT_ARTIST_SEARCH)
            .map(item => _.capitalize(item.params))
            .uniqWith((a, b) => { return _.lowerCase(a) == _.lowerCase(b) })
            .value();
        console.log("Searched artists", artists);

        const cities = _.chain(data.Items)
            .sortBy(item => item.params)
            .filter(item => item.event === constantsEvents.EVENT_LOCATION_SEARCH)
            .map(item => _.capitalize(item.params))
            .uniqWith((a, b) => { return _.lowerCase(a) == _.lowerCase(b) })
            .value();
        console.log("Searched cities", cities);

        const artistsStr = _.join(artists, ', ');
        const citiesStr = _.join(cities, ', ');

        const artistsItem = {
            TableName: 'top_artists',
            Item: {
                user_id: {
                    S: String(userId),
                },
                top_artists: {
                    S: String(artistsStr),
                },
            }
        };
    
        console.log('put artists', artistsItem);
        artistsStr && await dynamodb.putItem(artistsItem).promise();

        const citiesItem = {
            TableName: 'top_cities',
            Item: {
                user_id: {
                    S: String(userId),
                },
                top_cities: {
                    S: String(citiesStr),
                },
            }
        };
    
        console.log('put cities', citiesItem);
        citiesStr && await dynamodb.putItem(citiesItem).promise();

        return {
            artists,
            cities,
        };
    } catch(error) {
        console.log("Error", error);
    }
}

module.exports = {
    startAnalysis,
}