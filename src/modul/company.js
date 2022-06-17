const pool = require("../config/pg");

const companyModel = {
  getProfile: (id) => {
    return pool.query("SELECT * FROM company where idcompany = $1", [id]);
  },
  editProfile: (data) => {
    return pool.query(
      `UPDATE company SET companyname = COALESCE ($1,companyname), jobfield = COALESCE ($2,jobfield), companyaddress = COALESCE ($3,companyaddress), description = COALESCE ($4,description), emailcompany = COALESCE ($5,emailcompany),instagram = COALESCE ($6,instagram),companyphone = COALESCE ($7,companyphone),linkedin = COALESCE ($8,linkedin) WHERE idcompany = $9`,
      [data.company, data.jobfield, data.address, data.description, data.email, data.instagram, data.phone, data.linkedin, data.id]
    );
  },
  deleteProfile: (id) => {
    return pool.query("DELETE FROM company WHERE id = $1", [id]);
  },
  profileImage: (data) => {
    return pool.query("UPDATE company SET profileimage = $1 WHERE idcompany = $2", [data.image, data.id]);
  },
};

module.exports = companyModel;
