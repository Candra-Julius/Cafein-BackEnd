const pool =require('../config/pg')

const workerModel = {
    getProfile: (id) => {
        return pool.query('SELECT * FROM users where iduser = $1', [id])
    }
}

module.exports = workerModel