const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: "us-east-1_zcjwYByK6",
    ClientId: "6s22mre41r0s1gq78ir0ra0lir"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const Login = (request, context, callback) => {
    const body = JSON.parse(request.body);
    console.log(body);

    const email = body.email;
    const password = body.password;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : email,
        Password : password,
    });

    const userData = {
        Username : email,
        Pool : userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
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
        onFailure: function(err) {
            console.log(err);
            callback(null, {
                'statusCode': 500,
                'body': JSON.stringify({
                    error: err.message,
                }),
            });
        },
    });
}

exports.handler = Login;