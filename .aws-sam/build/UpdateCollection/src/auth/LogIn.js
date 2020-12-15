const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const {COGNITO_PROD} = require('../constants').constants;

const Login = (request, context, callback) => {
    console.log(request);
    const body = JSON.parse(request.body);
    console.log(body);

    const email = body.email;
    const password = body.password;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : email,
        Password : password,
    });

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_PROD);
    const userData = {
        Username : email,
        Pool : userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    console.log(cognitoUser);
    cognitoUser.authenticateUser(authenticationDetails,
        {
            onSuccess: (result) => {
                console.log('here')
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('id token + ' + result.getIdToken().getJwtToken());
                console.log('refresh token + ' + result.getRefreshToken().getToken());

                callback(null, {
                    'statusCode': 200,
                    'body': JSON.stringify({
                        access_token: result.getAccessToken().getJwtToken(),
                        id_token: result.getAccessToken().getJwtToken(),
                        refresh_token: result.getRefreshToken().getToken(),
                    }),
                });
            },
            onFailure: (err) => {
                console.log('err')
                console.log(err);
                callback(null, {
                    'statusCode': 500,
                    'body': JSON.stringify({
                        error: err.message,
                    }),
                });
            }
        }
    )
}

exports.handler = Login;