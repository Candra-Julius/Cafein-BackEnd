const pool = require("../config/pg");

const companyModel = {
  getProfile: (id) => {
    return pool.query("SELECT * FROM company where idcompany = $1", [id]);
  },
  editProfile: (data) => {
    return pool.query("UPDATE company SET companyname = $1, jobfield = $2, companyaddress = $3, description = $4, emailcompany = $5,instagram =$6,companyphone=$7,linkedin =$8 WHERE idcompany = $9", [
      data.company,
      data.jobfield,
      data.address,
      data.description,
      data.email,
      data.instagram,
      data.phone,
      data.linkedin,
      data.id,
    ]);
  },
  deleteProfile: (id) => {
    return pool.query("DELETE FROM company WHERE id = $1", [id]);
  },
  profileImage: (data) => {
    return pool.query("UPDATE company SET profileimage = $1 WHERE idcompany = $2", [data.image, data.id]);
  },
};

module.exports = companyModel;
