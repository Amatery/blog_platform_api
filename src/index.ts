import express, { Request, Response } from 'express'
import { settings } from '../settings'
import { connectDB } from './database/database-config'
import { blogsService } from './domain/blogs-service'
import { commentsService } from './domain/comments-service'
import { postsService } from './domain/posts-service'
import { usersService } from './domain/users-service'
import { STATUS_CODES } from './helpers/StatusCodes'
import { authorizationRouter } from './routes/authorization-router'
import { blogsRouter } from './routes/blogs-router'
import { commentsRouter } from './routes/comments-router'
import { postsRouter } from './routes/posts-router'
import { usersRouter } from './routes/users-router'
import cookieParser from 'cookie-parser'

const app = express()
const port = settings.PORT
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Welcome to blog platform API!')
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authorizationRouter)
app.use('/comments', commentsRouter)

/** ONLY FOR E2E TESTS **/
app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsService._deleteAllBlogs()
  await postsService._deleteAllPosts()
  await usersService._deleteAllUsers()
  await commentsService._deleteAllComments()
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
/**             **/

const startServer = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`🚀🚀🚀🚀 App listening on ${port}`)
  })
}


startServer().then(r => r)
