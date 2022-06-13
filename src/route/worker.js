const express = require('express')
const workerControl = require('../controler/worker')
const { isLogin } = require('../middleware/verification')
const router = express.Router()

router
.get('/profile', isLogin, workerControl.getProfile)

module.exports = router