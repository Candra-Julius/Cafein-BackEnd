const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const verif = {
    isLogin: (req, res, next) => {
        try {
            if (req.headers.authorization){
                token = req.headers.authorization.split(' ')[1]
                const decode = jwt.verify(token, process.env.SECRET_KEY_JWT)
                console.log(decode);
                req.payload = decode
                next()
            }else {
                next(createError[401]('Please Login'))
            }
        } catch (error) {
            console.log(error)
      res.json({
        error
      })
        }
    }
}

module.exports = verif