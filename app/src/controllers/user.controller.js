import { User } from 'database';
import _ from 'lodash';
import APIError from 'helpers/APIError';
import httpStatus from 'http-status';
// import validator from 'validator';
// import { ObjectID } from 'mongodb';
import _response from 'helpers/response';
import UserService from '../services/user';

/**
 *@name todoController
 *@returns {Object} Functions
 */

const usersController = (() => ({
    /**
     *@name create
     *@description creates a new user
     *@param {Object} request
     *@param {Object} response
     *@returns {Null} null
     */

    create(request, response, next) {
        const infoArray = ['username', 'email', 'password', 'profileImg', 'firstName', 'lastName', 'dob', 'stateOfOrigin', 'sex', 'occupation', 'street']
        const userInfo = _.pick(request.body, infoArray)
        const passwordSymbol = userInfo.password
        if (passwordSymbol.indexOf('*') != -1) {
            var err = new APIError(
                'Password contains (*) symbol which is not allowed !',
                httpStatus.UNPROCESSABLE_ENTITY,
            );
            return next(err)
        }

        User.findOne({ email: userInfo.email })
            .then((userExists) => {
                if (userExists) {
                    var err = new APIError('User already exists!', httpStatus.UNPROCESSABLE_ENTITY);
                    return next(err);
                }
                const newUser = new User(userInfo);
                newUser
                    .save()
                    .then(() => newUser.generateAuthToken())
                    .then((token) => {
                        UserService.createUserWallet(newUser);
                        response
                            .header('x-auth', token)
                            .status(200)
                            .send({
                                ..._response,
                                data: {
                                    token,
                                    _id: newUser._id,
                                },
                                message: `Created User: ${newUser.email}`,
                                status: httpStatus.OK,
                            });
                    })
                    .catch((err) => {
                        next(err);
                    });
            })
            .catch((err) => {
                next(err);
            });
        return null
    },
}))()

export default usersController;