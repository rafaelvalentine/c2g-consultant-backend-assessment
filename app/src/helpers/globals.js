import fs from 'fs'
import crypto from 'crypto'

const globalHelpers = (() => ({
    /**
     *@name randomString
     *@description generates a random string
     *@param {Number} length
     *@returns {String} random
     */
    randomString(length = 128) {
        return crypto.randomBytes(length).toString('hex');
    },

    /**
     *@name encodeBase64Image
     *@description generates a base64 string
     *@param {File} file
     *@returns {Buffer} buffer
     */
    encodeBase64Image(file) {
        // read binary data
        const bitmap = fs.readFileSync(file);
        // convert binary data to base64 encoded string
        return new Buffer(bitmap).toString('base64');
    },

    /**
     *@name randomString
     *@description generates a random string
     *@param {Number} length
     *@returns {String} random
     */
    //  decodeBase64Image(base64Str, file) {
    //     // read binary data
    //     const bitmap = fs.readFileSync(file);
    //     // convert binary data to base64 encoded string
    //     return new Buffer(bitmap).toString('base64');
    // },
}))()

export default globalHelpers;