import express from 'express'
import { validate } from 'express-validation'
import { validationSchema } from 'config'
import { authenticate } from 'middleware'
import authController from 'controllers/auth.controller'

const AuthRoute = express.Router()

AuthRoute.get('/me', authenticate, authController.user)
    .post(
        '/login',
        validate(validationSchema.login, { keyByField: true }, {}),
        authController.login,
    )
    .delete('/logout', authenticate, authController.logout)

export default AuthRoute;