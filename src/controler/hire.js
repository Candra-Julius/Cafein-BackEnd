const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getProfile, editProfile, deleteProfile } = require("../modul/hire");

const hireControl = {
  getHire: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const {
        rows: [result],
      } = await getProfile(id);
      delete result.password;
      res.status(200).json({
        message: `wellcome ${result.name}`,
        result,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"));
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const id = req.payload.id;
      console.log(result);
      const { companyname, jobfield, companyaddress, description, emailcompany, instagram, companyphone, linkedin } = req.body;
      const data = {
        id,
        companyname,
        jobfield,
        companyaddress,
        description,
        emailcompany,
        instagram,
        companyphone,
        linkedin,
        profileimage: result.secure_url,
      };
      await editProfile(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `data update success`,
      });
    } catch (error) {}
  },
  deleteProfile: async (req, res, next) => {
    try {
      const id = req.payload.id;
      await deleteProfile(id);
      res.json({
        message: "data berhasil di hapus",
      });
    } catch (err) {
      console.log(err);
      next(new createError.InternalServerError());
    }
  },
};

module.exports = hireControl;
