import express from 'express'
import { authenticate } from 'middleware'
import taskController from 'controllers/task.controller'

const TaskRoute = express.Router()

TaskRoute
    .get('/', authenticate, taskController.fetchall)
    .post('/', authenticate, taskController.create)
    .patch('/:id', authenticate, taskController.patch)
    .delete('/:id', authenticate, taskController.delete)


export default TaskRoute