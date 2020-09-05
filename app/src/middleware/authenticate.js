const validator = require('validator')
const _ = require('lodash')
const _response = require('../helpers/response');
import httpStatus from 'http-status'
import createError from 'http-errors'
const { User } = require('../database')

const authenticate = (request, response, next) => {

    let bearerToken = request.headers.authorization || (request.header('x-auth') || '')
    const bearer = 'Bearer'
    let token

    if (validator.contains(bearerToken, bearer)) {
        const [_bearer, _token] = _.split(bearerToken, ' ')
        token = _token
    } else {
        token = bearerToken
    }

    User.findByToken(token)
        .then(user => {
            if (!user) {
                return Promise.reject(createError(httpStatus.BAD_REQUEST, 'Token failure!'))
            }
            request.user = user
            request.token = token
            next()
        })
        .catch(err => {
            err.type = 'token'
            next(err)
        })
}
module.exports = authenticate