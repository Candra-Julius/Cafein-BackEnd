const express = require('express')
const workerControl = require('../controler/worker')
const router = express.Router()
const auth =require('./auth')
const worker = require('./worker.js')
const company = require("./company.js");

router
.use('/auth', auth)
.use('/users', worker)
.use("/company", company)
.get('/home', workerControl.getAllProfile)
module.exports = router
