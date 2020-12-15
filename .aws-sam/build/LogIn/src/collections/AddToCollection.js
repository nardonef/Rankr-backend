const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const {apiAuth, handleApiErrors} = require('../auth/ApiAuth');

const AddToCollection = async (event) => {
    const body = JSON.parse(event.body);
    let userId, collection;

    try {
        userId = await apiAuth(event);
        collection = await getCollection(userId, body.name);
    } catch (e) {
        return handleApiErrors(e.message);
    }

    if (!body.item) {
        return {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error adding item',
            }),
        }
    }

    body.item.order = collection.items.length;

    const params = {
        TableName: TABLE_NAME,
        Key: {
            key : `COLLECTION#${userId}`,
            name: body.name,
        },
        UpdateExpression: `set #i = list_append(#i, :i)`,
        ExpressionAttributeNames: {'#i' : 'items'},
        ExpressionAttributeValues: {
            ':i' : [body.item]
        }
    };

    let response = {
        'statusCode': 200,
        'body': JSON.stringify({item: body.item}),
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

const getCollection = async (userId, name) => {
    const dynamoResponse = await docClient.query({
        TableName : TABLE_NAME,
        KeyConditionExpression: "#key = :k and #name = :n",
        ExpressionAttributeNames:{
            "#key": "key",
            "#name": "name",
        },
        ExpressionAttributeValues: {
            ":k": `COLLECTION#${userId}`,
            ":n": name,
        }
    }).promise();

    console.log(dynamoResponse);
    return dynamoResponse.Items[0];
}

exports.handler = AddToCollection;