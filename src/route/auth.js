const express = require('express')
const authControl = require('../controler/auth')
const router = express.Router()

router
.post('/regisworker', authControl.registerWorker)
.post('/regisemp', authControl.registerEmp)
.post('/login', authControl.login)
.get('/activate/:token/:id', authControl.activation)
.post('/forgotpassword', authControl.forgotPassword)
.put('/forgot/:token', authControl.resetPassword)

module.exports = router