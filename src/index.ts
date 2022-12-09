import express from 'express'

const app = express()
const port = process.env.PORT || 3003

app.get('/', (req, res) => {
  res.send('Blog platform API!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
