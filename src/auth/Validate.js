const fetch = require('node-fetch');
const jwkToPem = require('jwkToPem');
const jwt = require('jsonwebtoken')

exports.Validate = (token, callback) => {
    fetch(`https://cognitoidp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`)
        .then((response) => {
            // if (response.statusCode === 200) {
            let pems = {};
            const keys = response['keys'];
            for(let i = 0; i < keys.length; i++) {
                const key_id = keys[i].kid;
                const modulus = keys[i].n;
                const exponent = keys[i].e;
                const key_type = keys[i].kty;
                const jwk = { kty: key_type, n: modulus, e: exponent};
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
            jwt.verify(token, pem, function(err, payload) {
                if(err) {
                    console.log("Invalid Token.");
                    throw new Error('Invalid token');
                } else {
                    console.log("Valid Token.");
                    return true
                }
            });
            // }
            // else {
            //     console.log("Error! Unable to download JWKs");
            //     callback(error);
            // }
    });
}