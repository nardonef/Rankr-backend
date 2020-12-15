const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const {apiAuth, handleApiErrors} = require('../auth/ApiAuth');

const updateItems = async (event) => {
    const body = JSON.parse(event.body);
    let userId;

    try {
        userId = await apiAuth(event);
    } catch (e) {
        return handleApiErrors(e.message);
    }

    if (!body.items) {
        return {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error updating items',
            }),
        }
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            key : `COLLECTION#${userId}`,
            name: event.pathParameters.collectionName,
        },
        UpdateExpression: `set #i = :i`,
        ExpressionAttributeNames: {'#i' : 'items'},
        ExpressionAttributeValues: {
            ':i' : body.items
        }
    };

    let response = {
        'statusCode': 200,
        'body': JSON.stringify({item: body.items}),
    };

    try {
        await docClient.update(params).promise();
    } catch (e) {
        console.log(e);
        response = {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error adding item',
            }),
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

exports.handler = updateItems;