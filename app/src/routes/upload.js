import express from 'express'
import { validate } from 'express-validation'
import { validationSchema } from 'config'
import { authenticate } from 'middleware'
import uploadController from 'controllers/upload.controller'

const UploadRoute = express.Router()

UploadRoute
// .get('/me', authenticate, uploadController.user)
    .post('/attachments', authenticate, uploadController.fileUpload);

export default UploadRoute;