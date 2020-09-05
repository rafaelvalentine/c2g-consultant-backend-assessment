import express from 'express'
import authRoutes from './auth'
import tasksRoutes from './tasks'
import todosRoutes from './todos'
import uploadRoutes from './upload'
import userRoutes from './users'

const router = express.Router()

router.get('/is-alive', function(req, res, next) {
        res.render('index', { title: 'Express' })
    })
    // mount auth routes at /auth
router.use('/auth', authRoutes)

// mount tasks routes at /tasks
router.use('/task', tasksRoutes)

// mount todos routes at /todos
router.use('/todo', todosRoutes)

// mount todos routes at /todos
router.use('/user', userRoutes)


// mount upload routes at /upload
router.use('/upload', uploadRoutes)
export default router