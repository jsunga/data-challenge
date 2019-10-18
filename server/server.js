const express = require('express')
const routes = require('./router/router')
const bodyParser = require('body-parser')

// Database Connection
const db = require('./config/database')

// Express Server
const port = process.env.PORT || 5000
const app = express()
const path = require('path')

// Path
app.use(express.static(path.join(__dirname, '../client/build')))

// Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// Router
app.use('/api', routes)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'), err => {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(port, () => console.log(`Server running on port ${port}`))