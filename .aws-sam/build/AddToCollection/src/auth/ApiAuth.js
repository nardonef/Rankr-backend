const {validateToken} = require('../auth/Validate');

exports.apiAuth = async (event) => {
    console.info('received:', event);
    return await validateToken(event.headers.Authorization);
}

exports.handleApiErrors = (message) => {
    const body = JSON.stringify({
        error: message,
    });

    if (message === 'TokenExpiredError') {
        return {
            statusCode: 401,
            body: body,
        }
    } else {
        return {
            statusCode: 500,
            error: body,
        }
    }
}