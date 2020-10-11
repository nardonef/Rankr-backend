const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const poolData = {
    UserPoolId: "us-east-1_zcjwYByK6",
    ClientId: "6s22mre41r0s1gq78ir0ra0lir"
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

const SignUp = (request, context, callback) => {
    const body = JSON.parse(request.body);
    console.log(body);

    const email = body.email;
    const password = body.password;

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