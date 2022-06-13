const jwt = require('jsonwebtoken')
const createError = require('http-errors') 
const { getProfile } = require('../modul/worker')

const workerControl = {
    getProfile: async(req, res, next) => {
        try {
            // const {id} = jwt.decode(localStorage.getItem('token'))
            const id = req.payload.id
            const {rows: [result]} = await getProfile(id)
            delete result.password
            res.status(200).json({
                message: `wellcome ${result.fullname}`,
                result
            })
        } catch (error) {
            console.log(error);
            next(createError[500]('internal server error'))
        }
    },
    editProfile: async(req, res, next) => {
        const id = req.payload
        console.log(id);
    }
}

module.exports = workerControl