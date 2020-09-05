import { User, Upload } from 'database'
import _ from 'lodash'
// import APIError from 'helpers/APIError'
import httpStatus from 'http-status'
// import createError from 'http-errors'
// import validator from 'validator'
// import { ObjectID } from 'mongodb'
import _Response from 'helpers/response'
// import UserService from '../services/user'
import Global from 'helpers/globals'

// const postDIR = '/post/';
// const profileDIR = '/profile/';
// const chatDIR = '/chat/';
const fileDIR = '/files/';

/**
 *@name uploadController
 *@returns {Object} Functions
 */

const uploadController = (() => ({
    /**
     *@name fileUpload
     *@description handles file(s) uploads
     *@param {Object} request
     *@param {Object} response
     *@returns {Null} null
     */

    fileUpload(request, response, next) {
        const Response = {..._Response };
        const data = []
        if (!request.files || Object.keys(request.files).length === 0) {
            Response.status = httpStatus.BAD_REQUEST;
            Response.data = null;
            Response.message = 'No files were uploaded.';
            return response.send(Response);
        }

        if (request.files.attachments.length > 1) {
            // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
            const { files } = request;
            // loop all files
            _.forEach(_.keysIn(files.attachments), (key) => {
                const file = files.attachments[key];
                const filename = Global.randomString(20) + file.name

                // Use the mv() method to place the file somewhere on your server
                file.mv(`./app/public/uploads${fileDIR}${filename}`, function(err) {
                    if (err) {
                        Response.status = httpStatus.INTERNAL_SERVER_ERROR
                        Response.data = null
                        Response.message = 'No files were uploaded.'
                        return response.send(Response)
                    }
                });
                Upload.create({
                        filename,
                        contentType: file.mimetype,
                        filesize: file.size,
                        userId: request.user._id,
                        fileURL: `${process.env.APP_API_BASE_URL}/uploads${fileDIR}${filename}`,
                    })
                    .then(_file => {
                        console.log('upload done!!!')
                    })
                    .catch(err => {
                        Response.status = httpStatus.INTERNAL_SERVER_ERROR
                        Response.data = null
                        Response.message = 'No files were uploaded.'
                        Response.errMessage = err.message
                        return response.send(Response)
                    })

                data.push({
                    filename,
                    contentType: file.mimetype,
                    filesize: file.size,
                    userId: request.user._id,
                    fileURL: `${process.env.APP_API_BASE_URL}/uploads${fileDIR}${filename}`,
                });
            })
            Response.data = data
            Response.message = 'Files uploaded.'
            response.send(Response);
            return
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const file = request.files.attachments;

        // randomize file name 
        const filename = Global.randomString(20) + file.name;

        // Use the mv() method to place the file somewhere on your server
        file.mv(`./app/public/uploads${fileDIR}${filename}`, function(err) {
            if (err) {
                Response.status = httpStatus.INTERNAL_SERVER_ERROR;
                Response.data = null;
                Response.message = 'No files were uploaded.';
                return response.send(Response);
            }
            Upload.create({
                    filename: filename,
                    contentType: file.mimetype,
                    filesize: file.size,
                    userId: request.user._id,
                    fileURL: `${process.env.APP_API_BASE_URL}/uploads${fileDIR}${filename}`,
                })
                .then(file => {
                    Response.data = file
                    Response.message = 'Files uploaded.';
                    response.send(Response);
                })
                .catch(err => {
                    Response.status = httpStatus.INTERNAL_SERVER_ERROR;
                    Response.data = null;
                    Response.message = 'No files were uploaded.';
                    Response.errMessage = err.message;
                    return response.send(Response);
                })
        });
    },
}))();

export default uploadController;