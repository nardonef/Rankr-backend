const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const {COGNITO_PROD} = require('../constants').constants;

const Refresh = (request, context, callback) =>{
    const body = JSON.parse(request.body);
    console.log(body);

    const email = body.email;
    const RefreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.NGMOVaovDIMr-SmqWaDbu9ghqmaLOYTIOqicuTf_ePuPgVk0u3Qd4jBV-1VaULfXTFz-yqCx5hsi7y30MyeioWos2pSwTVern6-punKwqNyV2DiqllmBa7_wEt6dP2GP1OM3v_8_5ZrfnfgtoUDaNISR9MctgVooTwI1iSh9XQyDIBXIkfFFq3FM8PY1LNQg14rz3uZnkGzmi2a6fhLd2sw1_Bj_93j9Dr869QLPVUO5NYbKcXU0_-rumwDdELrdsTzzMCoiITK-mIBPcbCXB0B9ga5HJYbwPQ47Iqf1cWg1CFn7megl-wHh97qehm2CgGhJjMDigr2lKEFH3TkhLQ.3rZC3b-1evURvl0m.3YUxjzfp0ljHbNS1WjycD8RjXUud0VLriZqoPpkYtnV07oDaJIesnF8AeXqFAefPf48WfEPjiqU1QkboFlBGVumgTBxJanWGQE544JgAw5z0prL2itIDgAMF8LYuNXVyJ4Elbl1Ue4NhruJfBhlmbIZtSTwG_yTedOLEpkqz1NtH7EfUY4A1jzs_oIiL_FEPqH4aWqfxtikYZKpL9Ej6MAxH9i2wlZbIdhbzO7LwWK7V8pw0Yfp_RqEeTpk8Z4u4ClrNv-V7ucED-R_B9cOiuKwcTzDGhVcIhjXseUCIC91VPAA7gdTialMmwU6-EAcZeZPrMNcgxhi1stJ0AkXzn1P29q4cOPWONgtuSx7ePcZ6pyuIz8Drt46yEDIlAUCbptU9a5AZhOVU0syWUZVtZgUtzwBXJRpKYPiUYUt2K4leq57myooNn6Q2b6B8DDgAW08YMpNM1ndoSx4nak5ZdJ2-lsqa-DiyV-kAxElVgwVAXVYRMDZeNHrgnGuU6aA64xwxB76ZRj6XZ3YmqQyJxevJ2w-IsIW5IKKRcDWwWtcL0NMqXBDl0xmuJvjF-BF35sv-5TB12g5I6dUaJ-87QXMHGF7jqGv1P5ohKt0-B9V0TQ36MPXQ3nAoddptax2Q1FpjJxO2DglGSMcVRlzg0BbqtuLYn8xzBaHTuHj0RWZd4QM-Rp1pvcOCE_iLxfz8jUQAWSYXlfP-ToRPjcK-Nf4nJFHVkdLeXX-hSirDVjXvHiADDck85gjZOnsRwI2PD0HxtLRXHsGK3odpR1X4r-YC2UHd9mDySnWbGKCw2Guty5FntoQNQ3o_J1gBBto6z-Xic8GWplPE74ae0A2X1TGxKU5kGrsrbWmovc44wZLcE9kvNU9B2vDQ5OUaI-ua_Q0nMWQvyWUKeFAm7qguQVs834sqn83Ah3OvTBCaqQgyzT3mctWrvzm9A3_xrY_ZktexUW5h57xKjdYPZSVniZb7gTZWzDjgO8und2RBqIRnoBTHUc8PHRJs0EM3LYdexaekMHeYvJvDLLS7Q3l6qL4ZUtTxYt1QRl3cSLiBLWC2wfLhXQuoE4dqQwrMErO1u6mXPLLYqmgBNA5SST1vrDbdLuWgfX2dMgovcJsFG8K8l5ekGpFEXBO7ACy1Tb0j8oBOljH3EYb2ajfQlnTpEhu1n8vBDZi4rj7zNZwHSRMmqWZMjFxBPeqxdt61HiWPwoXYxhnNnEhLT7rCQH3GOp1gn_RUd2pJH86aYw45MFIaq_TRuq6J1S5Ce-NXgFX4BnKhup4tzYAXpD7mWlP9uV0_4nPNr8ycirZfxEKpsQi-HlioyEXSldWwqyw.l5ETmj8eTFd9VJUKm82gqQ"});

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(COGNITO_PROD);

    const userData = {
        Username: email,
        Pool: userPool
    };

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.refreshSession(RefreshToken, (err, session) => {
        if (err) {
            console.log(err);
            callback(null, {
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
            callback(null, {
                'statusCode': 200,
                'body': JSON.stringify(retObj),
            });
        }
    })
}

exports.handler = Refresh;