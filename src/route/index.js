const express = require('express')
const workerControl = require('../controler/worker')
const router = express.Router()
const auth =require('./auth')
const worker = require('./worker.js')

router
.use('/auth', auth)
.use('/users', worker)
.get('/', workerControl.getAllProfile)
module.exports = router