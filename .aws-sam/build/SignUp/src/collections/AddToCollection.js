const {TABLE_NAME} = require('../constants').constants;
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const {validateToken} = require('../auth/Validate')

const AddToCollection = async (event) => {
    console.info('received:', event);
    const body = JSON.parse(event.body);
    const userId = await validateToken(event.headers.Authorization);

    if (!body.item) {
        return {
            statusCode: 500,
            error: JSON.stringify({
                error: 'error adding item',
            }),
        }
    }

    const params = {
        TableName: TABLE_NAME,
        Key: {
            key : `COLLECTION#${userId}`,
            name: 'Test1',
        },
        UpdateExpression: 'set #i = list_append(#i, :i)',
        ExpressionAttributeNames: {'#i' : 'items'},
        ExpressionAttributeValues: {
            ':i' : [body.item]
        }
    };

    let response = {
        'statusCode': 200,
        'body': ' ',
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

exports.handler = AddToCollection;