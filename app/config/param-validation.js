import { Joi } from 'express-validation'

export default {
    createUser: {
        body: Joi.object({
            email: Joi.string().email().required(),
            username: Joi.string().max(25).required(),
            password: Joi.string()
                .regex(/[a-zA-Z0-9]{3,30}/)
                .required()
        }),
    },
    updateUser: {
        body: {
            email: Joi.string().email().required(),
            username: Joi.string().required(),
            password: Joi.string().min(6).max(15).required(),
        },
        headers: {},
    },
    updateEmail: {
        body: {
            email: Joi.string().email().required(),
        },
    },
    deleteUser: {
        body: {
            password: Joi.string().min(6).max(15).required(),
        },
        headers: {
            x_auth: Joi.string().min(6).max(15).required(),
        },
    },
    // POST /api/auth/login
    login: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .regex(/[a-zA-Z0-9]{3,30}/)
                .required(),
        }),
    },
    // POST /api/users/forgot
    forgotPassword: {
        body: {
            phone: Joi.string().required(),
        },
    },

    // POST /api/user/changePassword
    changePassword: {
        body: {
            oldPassword: Joi.string().required(),
            password: Joi.string().required(),
        },
    },
    // POST /api/user/changePassword
    resetPassword: {
        body: {
            password: Joi.string().required(),
        },
    },
    // PATCH /api/users/forgot/verify
    forgotPasswordVerify: {
        body: {
            phone: Joi.string().required(),
            otp: Joi.string().required(),
        },
    },

    // TS: More to add
    // TODO: add the validation for other masters too
};