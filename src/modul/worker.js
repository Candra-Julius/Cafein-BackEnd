const pool =require('../config/pg')

const workerModel = {
    getProfile: (id) => {
        return pool.query('SELECT * FROM users where iduser = $1', [id])
    },
    editProfile: (data) => {
        return pool.query('UPDATE users SET fullname = $1, jobdesk = $2, address = $3, workplace = $4, description = $5 WHERE iduser = $6', [data.fullname, data.jobdesk, data.address, data.workplace, data.description, data.id])
    },
    getSkill: (id) => {
        return pool.query('SELECT * FROM skill WHERE users_Id = $1', [id])
    },
    addSkill: (id, skill) => {
        return pool.query('INSERT INTO skill (skillname, users_id) VALUES ($1, $2)',[skill, id])
    },
    getPortofolio: (id) => {
        return pool.query('SELECT * FROM portofolio WHERE id = $1', [id])
    },
    addPortofolio: (data) => {
        return pool.query('INSERT INTO portofolio (id, aplicationname, repolink, portotype, image) VALUES ($1, $2, $3, $4, $5)', [data.id, data.aplicationname, data.repolink, data.portotype, data.img]) 
    },
    getWorkExp: (id) => {
        return pool.query('SELECT * FROM workexp WHERE user_id = $1', [id])
    },
    addWorkExp: (data) => {
        return pool.query('INSERT INTO workexp (user_id, position, companyname, date, description) VALUES ($1, $2, $3, $4, $5)', [data.id, data.position, data.companyname, data.date, data.desc])
    },
    uploadAva: (data) => {
        return pool.query('UPDATE users SET profileimage = $1 WHERE iduser = $2', [data.image, data.id])
    }
}

module.exports = workerModel