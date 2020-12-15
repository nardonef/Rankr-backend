const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const {COGNITO_PROD} = require('../constants').constants;

exports.validateToken = async (token) => {
    const response = await axios.get(`https://cognito-idp.us-east-1.amazonaws.com/${COGNITO_PROD.UserPoolId}/.well-known/jwks.json`);
    let pems = {};
    const keys = response.data['keys'];
    for (let i = 0; i < keys.length; i++) {
        const key_id = keys[i].kid;
        const modulus = keys[i].n;
        const exponent = keys[i].e;
        const key_type = keys[i].kty;
        const jwk = {kty: key_type, n: modulus, e: exponent};
        pems[key_id] = jwkToPem(jwk);
    }
    const decodedJwt = jwt.decode(token, {complete: true});
    if (!decodedJwt) {
        console.log("Not a valid JWT token");
        throw Error('Not a valid JWT token');
    }
    const kid = decodedJwt.header.kid;
    const pem = pems[kid];
    if (!pem) {
        console.log('Invalid token');
        throw new Error('Invalid token');
    }
    jwt.verify(token, pem, function (err, payload) {
        if (err) {
            console.log(err.name);
            throw new Error(err.name);
        } else {
            console.log("Valid Token.");
        }
    });
    console.log(decodedJwt.payload)

    if (decodedJwt.payload['cognito:username']) {
        return decodedJwt.payload['cognito:username'];
    }
    return decodedJwt.payload.username;
}