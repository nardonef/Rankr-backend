const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const aws = require('aws-sdk');
const {COGNITO_PROD} = require('../constants').constants;

const Refresh = async (request) =>{
    const body = JSON.parse(request.body);
    console.log(body);
    console.log(request.headers);

    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: body.tokens.refresh_token});

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_PROD);

    const userData = {
        Username: request.headers['x-user-email'],
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
        cognitoUser.refreshSession(RefreshToken, (err, session) => {
            if (err) {
                console.log(err);
                reject({
                    'statusCode': 500,
                    'body': err.message,
                });
            } else {
                let retObj = {
                    "access_token": session.accessToken.jwtToken,
                    "id_token": session.idToken.jwtToken,
                    "refresh_token": session.refreshToken.token,
                }
                console.log(retObj);
                resolve({
                    'statusCode': 200,
                    'body': JSON.stringify(retObj),
                });
            }
        })
    })
}

exports.handler = Refresh;