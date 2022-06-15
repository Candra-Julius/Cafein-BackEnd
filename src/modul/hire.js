const pool = require("../config/pg");

const hireModel = {
  getHire: (id) => {
    return pool.query("SELECT * FROM hire WHERE idCompany = $1", [id]);
  },
  insertHire: (data) => {
    return pool.query("INSERT INTO hire(name,email,phonenumber,description,project,iduser,idcompany)VALUES($1,$2,$3,$4,$5,$6,$7)", [data.name, data.email, data.phonenumber, data.description, data.project, data.iduser, data.idcompany]);
  },
  editHire: (data) => {
    return pool.query("UPDATE Hire SET name = $1, email = $2, phonenumber = $3, description = $4, project = $5,iduser =$6,idcompany=$7 WHERE id = $8", [
      data.name,
      data.email,
      data.phonenumber,
      data.description,
      data.project,
      data.iduser,
      data.idcompany,
      data.id,
    ]);
  },
  deletehire: (id) => {
    return pool.query("DELETE FROM hire WHERE id = $1", [id]);
  },
};

module.exports = hireModel;
