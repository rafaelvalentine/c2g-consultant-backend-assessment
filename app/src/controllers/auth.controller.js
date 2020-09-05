import { User } from 'database'
import _ from 'lodash'
// import APIError from 'helpers/APIError'
import httpStatus from 'http-status'
import createError from 'http-errors'
// import validator from 'validator'
// import { ObjectID } from 'mongodb'
import _response from 'helpers/response'
// import UserService from '../services/user'

/**
 *@name authController
 *@returns {Object} Functions
 */

const authController = (() => ({
    /**
     *@name user
     *@description gets a user
     *@param {Object} request
     *@param {Object} response
     *@returns {Null} null
     */

    user(request, response, next) {
        response.status(200).send({
            ..._response,
            data: {
                token: request.token,
                user: _.pick(request.user, ['username',
                    'email',
                    'profileImg',
                    'firstName',
                    'lastName',
                    'dob',
                    'stateOfOrigin',
                    'sex',
                    'occupation',
                    'street',
                    '_id',
                    'userWallet',
                    'attachments'
                ]),
            },
            message: `Found User: ${request.user.email}`,
            status: httpStatus.OK,
        });
    },

    /**
     *@name login
     *@description login a user
     *@param {Object} request
     *@param {Object} response
     *@returns {Null} null
     */

    login(request, response, next) {
        const userInfo = _.pick(request.body, ['email', 'password']);
        // console.log(userInfo)
        User.findByCredentials(userInfo)
            .then(async(user) => ({
                user,
                token: await user.generateAuthToken()
            }))
            .then(({ user, token }) => {
                response
                    .header('x-auth', token)
                    .status(200)
                    .send({
                        ..._response,
                        data: {
                            token,
                            _id: user._id,
                        },
                        message: `Found User: ${user.email}`,
                        status: httpStatus.OK,
                    });
            })
            .catch((err) => {
                if (err.name === 'ReferenceError') {
                    return next(createError(httpStatus.BAD_REQUEST, "User doesn't not exist"))
                }
                next(err);
            });
    },

    /**
     *@name logout
     *@description logout a user
     *@param {Object} request
     *@param {Object} response
     *@returns {Null} null
     */

    logout(request, response) {
        const { user } = request;
        const { token } = request;
        user.deleteToken(token)
            .then(user => {
                    response.status(200).send({
                        ..._response,
                        message: `Logged out User: ${user.email}`,
                        status: httpStatus.OK,
                    });
                },
                () => {
                    response.send({
                        ..._response,
                        status: 400,
                        errMessage: 'Something went wrong',
                    });
                },
            );
    },
}))();

export default authController