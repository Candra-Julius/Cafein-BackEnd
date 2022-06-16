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
      const data = { id, company, jobfield, address, description, email, instagram, phone, linkedin };
      console.log(req.body);
      // const { company, jobfield, address, description, email, instagram, phone, linkedin } = req.body;
      // const data = {
      //   id,
      //   company,
      //   jobfield,
      //   address,
      //   description,
      //   email,
      //   instagram,
      //   phone,
      //   linkedin,
      // };
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
  profileImage: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        id,
        image: result.secure_url,
      };
      await profileImage(data);
      res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  test: async (req, res, next) => {
    try {
      const file = req.file;
      res.send(file);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = companyControl;
