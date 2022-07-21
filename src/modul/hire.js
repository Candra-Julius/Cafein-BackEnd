const pool = require("../config/pg");

const hireModel = {
  getHire: (id) => {
    return pool.query(
      "SELECT users.fullname AS workername,users.jobstatus AS workerjobstatus,users.phonenumber AS workerphone, hire.name AS hrdname, hire.email AS hrdemail, hire.phonenumber AS hrdphone, hire.project, hire.description, hire.status, hire.id, hire.iduser, hire.idcompany FROM hire INNER JOIN users ON hire.iduser = users.iduser where hire.idcompany=$1",
      [id]
    );
  },
  insertHire: (data) => {
    return pool.query("INSERT INTO hire(name,email,phonenumber,description,project,iduser,isread,idcompany)VALUES($1,$2,$3,$4,$5,$6,$7,$8)", [
      data.name,
      data.email,
      data.phonenumber,
      data.description,
      data.project,
      data.iduser,
      data.isread,
      data.idcompany,
    ]);
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
