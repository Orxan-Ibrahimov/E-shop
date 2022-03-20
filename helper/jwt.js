const expressJWT = require('express-jwt');

function authJwt(params) {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJWT({
        secret,
        algorithms: ['HS256'],
        isRevoked: Revoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods:['GET', 'OPTIONS']},
            {url: /\/api\/v1\/products(.*)/, methods:['GET', 'OPTIONS']},
            {url: /\/api\/v1\/categories(.*)/, methods:['GET', 'OPTIONS']},
           `${api}/users/login`,
           `${api}/users/register`
        ]
    })
}

async function Revoked(req,payload,done) {
    if(!payload.isAdmin) return done(null,true)

    return done()
}
module.exports = authJwt;