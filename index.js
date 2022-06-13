require('dotenv').config()
const express = require('express')
const createError = require('http-errors')
const app = express()
const PORT = process.env.PORT || 2000
const versioning = require('./src/route/index')
const cors = require('cors')


//middleware
app.use(express())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 204
}))

// routing
app.use('/v1', versioning)

//error handling
app.all('*', (req, res, next) => {
    next(new createError[404]())
  })
  
  app.use((err, req, res, next) => {
    const messError = err.message
    const statusError = err.status
  
    res.status(statusError).json({
      message: messError
    })
  })

//port
app.listen(PORT, ()=>{
    console.log(`${PORT} RUNING`);
})