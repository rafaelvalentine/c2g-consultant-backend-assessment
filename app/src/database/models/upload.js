const mongoose = require('mongoose')
const { trim } = require('lodash')

const schema = {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    filename: {
        type: String,
        required: true,
        trim: true
    },
    contentType: {
        type: String,
        required: true,
        trim: true
    },
    filesize: {
        type: Number,
        required: true,
        trim: true
    },
    fileURL: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: new Date().toISOString(),
    }
}

const collectionName = 'UploadedFile'
const fileSchema = new mongoose.Schema(schema)
fileSchema.virtual('user', {
    ref: 'User', // The model to use
    localField: 'userId', // Find people where `localField`
    foreignField: '_id', // is equal to `foreignField`
    // If `justOne` is true, 'members' will be a single doc as opposed to
    // an array. `justOne` is false by default.
    justOne: true,
})

const File = mongoose.model(collectionName, fileSchema)

module.exports = File;