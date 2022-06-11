require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 2000

//middleware
app.use(express())
// routing
app.get('/', function (req, res) {
    res.send('Hello World')
  })

//port
app.listen(PORT, ()=>{
    console.log(`${PORT} RUNING`);
})