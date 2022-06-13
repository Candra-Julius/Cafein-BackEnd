const express = require('express')
const router = express.Router()
const auth =require('./auth')
const worker = require('./worker.js')

router
.use('/auth', auth)
.use('/users', worker)

module.exports = router