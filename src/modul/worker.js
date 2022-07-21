const pool = require("../config/pg");

const workerModel = {
  getProfile: (id) => {
    return pool.query("SELECT * FROM users where iduser = $1", [id]);
  },
  editProfile: (data) => {
    return pool.query("UPDATE users SET fullname = $1, jobdesk = $2, address = $3, workplace = $4, description = $5 WHERE iduser = $6", [data.fullname, data.jobdesk, data.address, data.workplace, data.description, data.id]);
  },
  editAllProfile: (data) => {
    return pool.query("UPDATE users SET fullname = $1, jobdesk = $2, address = $3, workplace = $4, description = $5, profileimage = $6 WHERE iduser = $7", [
      data.fullname,
      data.jobdesk,
      data.address,
      data.workplace,
      data.description,
      data.image,
      data.id,
    ]);
  },
  getSkill: (id) => {
    return pool.query("SELECT skillname FROM skill WHERE users_Id = $1", [id]);
  },
  addSkill: (id, skill) => {
    return pool.query("INSERT INTO skill (skillname, users_id) VALUES ($1, $2)", [skill, id]);
  },
  getPortofolio: (id) => {
    return pool.query("SELECT * FROM portofolio WHERE id = $1", [id]);
  },
  addPortofolio: (data) => {
    return pool.query("INSERT INTO portofolio (id, aplicationname, repolink, portotype, image) VALUES ($1, $2, $3, $4, $5)", [data.id, data.aplicationname, data.repolink, data.portotype, data.img]);
  },
  getWorkExp: (id) => {
    return pool.query("SELECT * FROM workexp WHERE user_id = $1", [id]);
  },
  addWorkExp: (data) => {
    return pool.query("INSERT INTO workexp (user_id, position, companyname, date, description) VALUES ($1, $2, $3, $4, $5)", [data.id, data.position, data.companyname, data.date, data.desc]);
  },
  uploadAva: (data) => {
    return pool.query("UPDATE users SET profileimage = $1 WHERE iduser = $2", [data.image, data.id]);
  },
  getAllProfile: (sortby, order, limit, offset) => {
    return pool.query(`SELECT * FROM users ORDER BY ${sortby} ${order} LIMIT ${limit} OFFSET ${offset}`);
  },
  getALlProfileDefault: (limit, offset) => {
    return pool.query(`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`);
  },
  searching: (search) => {
    return pool.query("SELECT * FROM skill WHERE skillname ILIKE $1", [search]);
  },
  verifySkill: (skill, id) => {
    return pool.query("select * from skill where skillname ILIKE $1 AND users_id = $2", [skill, id]);
  },
  countWorker: () => {
    return pool.query("SELECT COUNT(*) AS total FROM users");
  },
  getHire: (id) => {
    return pool.query(
      " SELECT company.companyname,hire.name AS hrdName,hire.email As hrdEmail, hire.phonenumber AS hrdEmail, hire.project, hire.description, hire.status,hire.id, hire.iduser, hire.idcompany,users.jobstatus, users.fullname As workerName FROM hire INNER JOIN company ON hire.idcompany = company.idcompany  INNER JOIN users  ON hire.iduser = users.iduser   where hire.iduser=$1",
      [id]
    );
  },
  editHire: (data) => {
    return pool.query("UPDATE Hire SET status = $1 WHERE id = $2", [data.status, data.id]);
  },
};

module.exports = workerModel;
