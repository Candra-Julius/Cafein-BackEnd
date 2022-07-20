require("dotenv").config();
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getProfile, editProfile, deleteProfile, profileImage } = require("../modul/company");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const companyControl = {
  getProfile: async (req, res, next) => {
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
      const { company, jobfield, address, description, email, instagram, phone, linkedin } = req.body;
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = { id, company, jobfield, address, description, email, instagram, phone, linkedin, image: result.secure_url };
      console.log(req.body);
      await editProfile(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `data profile company berhasil update `,
      });
    } catch (error) {
      console.log(error);
    }
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
  getProfileByParams: async (req, res, next) => {
    try {
      const id = req.params.id;
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
};

module.exports = companyControl;
