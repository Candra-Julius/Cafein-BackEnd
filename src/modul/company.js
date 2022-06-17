const pool = require("../config/pg");

const companyModel = {
  getProfile: (id) => {
    return pool.query("SELECT * FROM company where idcompany = $1", [id]);
  },
  editProfile: (data) => {
    return pool.query(
      `UPDATE company SET companyname = COALESCE ($1,companyname), jobfield = COALESCE ($2,jobfield), companyaddress = COALESCE ($3,companyaddress), description = COALESCE ($4,description), emailcompany = COALESCE ($5,emailcompany),instagram = COALESCE ($6,instagram),companyphone = COALESCE ($7,companyphone),linkedin = COALESCE ($8,linkedin),profileimage = COALESCE ($9,profileimage) WHERE idcompany = $10`,
      [data.company, data.jobfield, data.address, data.description, data.email, data.instagram, data.phone, data.linkedin, data.image, data.id]
    );
  },
  deleteProfile: (id) => {
    return pool.query("DELETE FROM company WHERE id = $1", [id]);
  },
};

module.exports = companyModel;
