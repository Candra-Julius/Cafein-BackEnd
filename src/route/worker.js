const express = require('express')
const workerControl = require('../controler/worker')
const { isLogin } = require('../middleware/verification')
const router = express.Router()

router
.get('/profile', isLogin, workerControl.getProfile)
.post('/profile', isLogin, workerControl.editProfile)
.post('/skill', isLogin, workerControl.addSkill)
module.exports = router