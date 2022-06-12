const pool =require('../config/pg')

const authModel= {
    checkEmailWorker: (email) => {
        return pool.query('SELECT * FROM users WHERE email = $1', [email])
    },
    checkEmailEmploy: (email) => {
        return pool.query('SELECT * FROM company WHERE email = $1', [email])
    },
    checkIdworker: (id) => {
        return pool.query('SELECT * FROM users WHERE iduser = $1', [id])
    },
    checkIdEmploy: (id) => {
        return pool.query(`SELECT * FROM company WHERE idcompany = ${id}`)
    },
    workRegis:(data) => {
        return pool.query('INSERT INTO users(iduser, fullname, email, password, phonenumber, role, status) VALUES($1, $2, $3, $4, $5, $6, $7)', [data.id, data.fullname, data.email, data.hash, data.phone, data.role, data.status])
    },
    empRegis: (data) => {
        return pool.query('INSERT INTO company(idcompany, name, email, phonenumber, companyname, password, role, status) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',[data.id, data.fullname, data.email, data.phone, data.companyName, data.hash, data.role, data.status])
    },
    activate: (route, idname, id ) => {
        console.log(`route ${route}`);
        console.log(`idname ${idname}`);
        console.log(`id ${id}`);
        return pool.query(`UPDATE ${route} SET status = 'active' where ${idname} = '${id}'`)
    },
    resetPassword: (route, hash, email) =>{
        return pool.query(`UPDATE ${route} SET password = '${hash}' WHERE email = '${email}'`)
    }
}

module.exports = authModel