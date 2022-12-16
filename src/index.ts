import express, { Request, Response } from 'express'
import { STATUS_CODES } from './helpers/StatusCodes'
import { blogsRepository } from './Models/Repositories/blogs-repository'
import { postsRepository } from './Models/Repositories/posts-repository'
import { blogsRouter } from './Routes/blogs-router'
import { postsRouter } from './Routes/posts-router'

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
app.delete('/testing/all-data', (req: Request, res: Response) => {
  blogsRepository.deleteAllBlogs()
  postsRepository.deleteAllPosts()
  res.sendStatus(STATUS_CODES.NO_CONTENT)
})
/**
 *
 */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
