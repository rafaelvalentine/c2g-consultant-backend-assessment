import express from 'express'
import { authenticate } from 'middleware'
import todoController from 'controllers/todo.controller'

const TodoRoute = express.Router()


TodoRoute
    .get('/:taskId', authenticate, todoController.get)
    .post('/', authenticate, todoController.create)
    .get('/:id', authenticate, todoController.fetch)
    .patch('/:id', authenticate, todoController.patch)
    .delete('/:id', authenticate, todoController.delete)

export default TodoRoute