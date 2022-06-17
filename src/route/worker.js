const express = require('express')
const workerControl = require('../controler/worker')
const { upload } = require('../helper/filehandler')
const { isLogin } = require('../middleware/verification')
const router = express.Router()

router
.get('/profile', isLogin, workerControl.getProfile)
.get('/profile/:id', workerControl.detailProfile)
.put('/profile', isLogin, upload.none(), workerControl.editProfile)
.post('/skill', isLogin, workerControl.addSkill)
.post('/workexp', isLogin, upload.none(), workerControl.addWorkExp)
.post('/portofolio', isLogin,upload.single('image'), workerControl.addPortofolio)
.post('/upload', isLogin, upload.single('avatar'), workerControl.uploadAva)
.get('/wroker', workerControl.getAllProfile)

module.exports = router