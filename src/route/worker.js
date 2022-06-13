const express = require('express')
const workerControl = require('../controler/worker')
const { isLogin } = require('../middleware/verification')
const router = express.Router()

router
.get('/profile', isLogin, workerControl.getProfile)
.post('/profile', isLogin, workerControl.editProfile)
.post('/skill', isLogin, workerControl.addSkill)
.post('/workexp', isLogin, workerControl.addWorkExp)
.post('/portofolio', isLogin, workerControl.addPortofolio)
module.exports = router