/* eslint-disable prettier/prettier */
const mongoose = require('mongoose')
const createError = require('http-errors')
const httpStatus = require('http-status')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const schema = {
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    profileImg: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    dob: {
        type: Number,
        required: true,
        minlength: 1,
        validate: {
            validator: value => new Date(value).getDate(),
            message: '{VALUE} is not a valid date'
        }
    },
    stateOfOrigin: {
        type: String,
        required: [true, 'Please Select State of Origin'],
        trim: true
    },
    street: {
        type: String,
        trim: true,
        required: [true, 'Please Enter Address']
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    state: {
        type: String,
        trim: true,
        default: ''
    },
    country: {
        type: String,
        default: '',
        trim: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    sex: {
        type: String,
        enum: {
            values: ['MALE', 'FEMALE'],
            message: 'Sex is either Male/Female'
        },
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isVerify: {
        type: Boolean,
        select: false,
        default: false
    },
    isVerifyByEmail: {
        type: Boolean,
        select: false,
        default: false
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString()
    }
}

const collectionName = 'User'
const userSchema = new mongoose.Schema(schema)

userSchema.virtual('userWallet', {
    ref: 'UserWallet', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'userId', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true
})
userSchema.virtual('attachments', {
    ref: 'UploadedFile', // The model to use
    localField: '_id', // Find people where `localField`
    foreignField: 'userId' // is equal to `foreignField`
        // // If `justOne` is true, 'members' will be a single doc as opposed to
        // // an array. `justOne` is false by default.
        // justOne: true
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    const authToken = _.findIndex(userObject.tokens, { 'access': 'auth' })
    const { token } = userObject.tokens[authToken]
    return {..._.pick(userObject, ['_id', 'email', 'createdAt', 'username']),
        token
    }
};
userSchema.methods.generateAuthToken = function() {
    const user = this
    const access = 'auth'
    const token = jwt.sign({ _id: user._id.toHexString(), access },
        process.env.JWT_SECRET, { expiresIn: process.env.JWT_TOKEN_VALIDATON_DURATION })
    user.tokens = user.tokens.concat([{ access, token }])
    return user.save()
        .then(() => token)
};

userSchema.methods.deleteToken = function(token) {
    const user = this
    const { tokens } = user
    user.tokens = _.filter(tokens, tokenObj => tokenObj.token !== token)
    return user.save()
};

userSchema.statics.findByToken = function(token) {
    const User = this
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject(error)
        })
    }
    userSchema.set('toObject', { virtuals: true })
    userSchema.set('toJSON', { virtuals: true })

    return User.findOne({
            _id: decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        }).populate({ path: 'userWallet' })
        .populate({ path: 'attachments' })
        .exec()
};
userSchema.statics.findByCredentials = function({ email, password }) {
    const User = this
    return User.findOne({ email })
        .then(user => {
            if (!user) {
                return Promise.reject(createError(httpStatus.BAD_REQUEST, "User doesn't not exist"))
            }
            return new Promise((resolve, reject) => {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        resolve(user)
                    } else {
                        reject(createError(httpStatus.BAD_REQUEST, 'Incompatible email/password !'))
                    }
                })
            })
        })
};
userSchema.pre('save', function(next) {
    const user = this
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                console.log(err)
                next(createError(httpStatus.UNPROCESSABLE_ENTITY, err))
                return;
            }
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) {
                    console.log(err)
                    next(createError(httpStatus.UNPROCESSABLE_ENTITY, err))
                    return;
                }
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

const User = mongoose.model(collectionName, userSchema)

module.exports = User