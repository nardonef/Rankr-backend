const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const {apiAuth, handleApiErrors} = require('../auth/ApiAuth');

const createCollection = async (event) => {
    let userId;

    try {
        userId = await apiAuth(event);
    } catch (e) {
        return handleApiErrors(e.message);
    }

    const body = JSON.parse(event.body);

    const item = {
        key: `COLLECTION#${userId}`,
        name: body.name,
        created_date: new Date().getTime(),
        items: []
    };

    const params = {
        TableName : TABLE_NAME,
        Item: item,
    };

    let response = {
        'statusCode': 200,
        'body': JSON.stringify(item),
    };

    try {
        await docClient.put(params).promise();
    } catch (e) {
        console.log(e);
        return handleApiErrors(e.message);

    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

exports.handler = createCollection;