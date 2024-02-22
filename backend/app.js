const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.send('Hello lightning world!')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})