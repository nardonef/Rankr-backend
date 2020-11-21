const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const {validateToken} = require('../auth/Validate')

const createCollection = async (event) => {
    console.info('received:', event);
    const body = JSON.parse(event.body);
    const userId = await validateToken(event.headers.Authorization);

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
        response = {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error creating item',
            }),
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}

exports.handler = createCollection;