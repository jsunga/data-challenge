  const express = require('express')
  const router = express.Router()

  // Imports
  const task = require('./task')

  // Routes
  router.use('/task', task)

  module.exports = router