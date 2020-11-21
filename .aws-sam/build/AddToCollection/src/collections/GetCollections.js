const {validateToken} = require('../auth/Validate')
const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
const getCollection = async (event) => {
    console.info('received:', event);
    const userId = await validateToken(event.headers.Authorization);

    const params = {
        TableName : TABLE_NAME,
        KeyConditionExpression: "#key = :k",
        ExpressionAttributeNames:{
            "#key": "key"
        },
        ExpressionAttributeValues: {
            ":k": `COLLECTION#${userId}`
        }
    };

    let response = {
        'statusCode': 200,
        'body': JSON.stringify([]),
    };

    try {
        const dynamoResponse = await docClient.query(params).promise();
        response.body = JSON.stringify(dynamoResponse.Items);
    } catch (e) {
        console.log(e);
        response = {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error getting items',
            }),
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

exports.handler = getCollection;