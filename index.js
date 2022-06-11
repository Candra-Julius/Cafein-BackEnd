require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000
const versioning = require('./src/route/index')

//middleware
app.use(express())
// routing
app.use('/v1', versioning)

//port
app.listen(PORT, ()=>{
    console.log(`${PORT} RUNING`);
})