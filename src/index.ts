import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { connectDB } from './database/database-config'
import { STATUS_CODES } from './helpers/StatusCodes'
import { blogsRepository } from './Repositories/blogs-repository'
import { postsRepository } from './Repositories/posts-repository'
import { blogsRouter } from './Routes/blogs-router'
import { postsRouter } from './Routes/posts-router'

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


/**
 * ONLY FOR E2E TESTS
 */
app.delete('/testing/all-data', async (req: Request, res: Response) => {
  await blogsRepository.deleteAllBlogs()
  await postsRepository.deleteAllPosts()
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
/**
 *
 */

const startServer = async () => {
  await connectDB()
  app.listen(port, () => {
    console.log(`✅ App listening on ${port}`)
  })
}


startServer()