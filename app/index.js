/* eslint-disable prettier/prettier */
// import env config
import '../settings/config.js'
// module imports
import 'idempotent-babel-polyfill'
import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import path from 'path'
import createError from 'http-errors'
import httpStatus from 'http-status'
import APIError from 'helpers/APIError'
import { ValidationError } from 'express-validation'
import cookieParser from 'cookie-parser'
import sassMiddleware from 'node-sass-middleware'
import listAllRoutes from 'express-list-endpoints'
import Table from 'cli-table'
import mongoose from 'mongoose'
import _ from 'lodash'
import fileUpload from 'express-fileupload'
// local imports
import { connectToDB } from 'config'
import BaseRoute from 'routes'

dotenv.config()

const app = express()
    // view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// use cors
const whitelist = [process.env.APP_BASE_URL]
const corsOptions = {
    origin(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}
app.use(cors())

// use body-parser
// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: false,
        parameterLimit: 50000,
    }),
)

// parse application/json
app.use(bodyParser.json({ limit: '50mb', extended: true }))

app.use(morgan('combined'))
app.use(helmet())
app.use(cookieParser())
app.use(
        sassMiddleware({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public'),
            indentedSyntax: true, // true = .sass and false = .scss
            sourceMap: true,
        }),
    )
    //enable file upload
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 5 * 1024 * 1024 * 1024 //5MB max file(s) size
    },
}));
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/v1', BaseRoute)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    if (err.type === 'token') {

        let apiError = new APIError(
            err.message,
            httpStatus.FORBIDDEN,
            err.isPublic
        )
        if (err.name === 'TokenExpiredError') {
            apiError = new APIError(
                'Your session has been timed out. Please login again to continue',
                httpStatus.UNAUTHORIZED,
                err.isPublic
            )
        }
        if (err.name === 'JsonWebTokenError') {
            apiError = new APIError(
                'Your Token is malformed',
                httpStatus.UNPROCESSABLE_ENTITY,
                err.isPublic
            )
        }
        return next(apiError)
    }
    if (err instanceof ValidationError) {
        // const detail = _.keys(err.details)
        console.log(' ValidationError error')
        const apiError = new APIError(err.details, httpStatus.BAD_REQUEST, err.isPublic)
        return next(apiError)
    }
    if (err instanceof mongoose.Error) {
        console.log('mongoose error')
        const apiError = new APIError(err.message, httpStatus.UNPROCESSABLE_ENTITY, err.isPublic)
        return next(apiError)
    }
    if (!(err instanceof APIError)) {
        console.log('APIError')
        const apiError = new APIError(err.message, err.status, err.isPublic)
        return next(apiError)
    }
    return next(err)

    // ValidationError

    // set locals, only providing error in development
    // res.locals.message = err.message
    // res.locals.error = req.app.get('env') === 'development' ? err : {}

    // // render the error page
    // res.status(err.status || 500)
    // res.render('error')
    // return null
})

// error handler, send stacktrace only during development
app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars

    // Email.systemError(err.stack)

    res.status(httpStatus.OK).json({
        status: err.status,
        response: false,
        data: null,
        message: null,
        errMessage: err.isPublic ? err.message : httpStatus[err.status]
    })
})

if (process.env.NODE_ENV !== 'production') {
    // Temporal, to aid development: Lists all API endpoints and methods
    let routes = listAllRoutes(app)
    routes = routes.map((route) => {
        const obj = {}
        obj[route.path] = route.methods.join(' | ')
        return obj
    })
    const table = new Table()
    table.push({ Endpoints: 'Methods' }, ...routes)

    console.log(table.toString())
}

// if (process.env.NODE_ENV === 'production') {
//     //   Set static folder.
//     app.use(express.static('client/build/'))
//     app.get(/.*/, (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

connectToDB()
module.exports = { app }