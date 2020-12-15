const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const {COGNITO_PROD} = require('../constants').constants;

const SignUp = (request, context, callback) => {
    const body = JSON.parse(request.body);
    console.log(body);

    const email = body.email;
    const password = body.password;

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_PROD);
    userPool.signUp(
        email,
        password,
        [],
        null,
        function(err, result) {
            if (err) {
                console.log(err);
                callback(null, {
                    'statusCode': 500,
                    'body': JSON.stringify({error: err.message}),
                });
            }
            callback(null, {
                'statusCode': 200,
                    'body': JSON.stringify({success: result}),
            });
        }
    );
}

exports.handler = SignUp;