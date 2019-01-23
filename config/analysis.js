const uuid = require('uuid');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

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
    
        dynamodb.query(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });
    } catch(error) {
        console.log("Error", error);
    }
}

module.exports = {
    startAnalysis,
}