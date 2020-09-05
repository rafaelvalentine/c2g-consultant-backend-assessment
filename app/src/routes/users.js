import express from 'express'
import usersController from 'controllers/user.controller'



const UserRoutes = express.Router()

UserRoutes
    .post('/register', usersController.create)

export default UserRoutes;