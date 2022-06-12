const jwt = require('jsonwebtoken')

const webToken = {
    generateToken: (payload) => {
        const expiresIn = {
            expiresIn: '1h',
            issuer: 'HireJob'
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, expiresIn)
        return token
    },
    generateRefreshToken: (payload) => {
        const expiresIn = {
            expiresIn: '1 day',
            issuer: 'HireJob'
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, expiresIn)
        return token
    },
}

module.exports = webToken