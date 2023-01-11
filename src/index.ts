import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from './database/database-config'
import { blogsService } from './domain/blogs-service'
import { postsService } from './domain/posts-service'
import { usersService } from './domain/users-service'
import { STATUS_CODES } from './helpers/StatusCodes'
import { authorizationRouter } from './Routes/authorization-router'
import { blogsRouter } from './Routes/blogs-router'
import { postsRouter } from './Routes/posts-router'
import { usersRouter } from './Routes/users-router'

dotenv.config()
const app = express()
const port = process.env.PORT || 3003
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.get('/', (req, res) => {
  res.send('Welcome to blog platform API!')
})

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authorizationRouter)


/**
 * ONLY FOR E2E TESTS
 */
app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsService._deleteAllBlogs()
  await postsService._deleteAllPosts()
  await usersService._deleteAllUsers()
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
/**
 *
 */

const startServer = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`🚀🚀🚀🚀 App listening on ${port}`)
  })
}


startServer().then(r => r)