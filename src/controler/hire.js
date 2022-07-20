const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getHire, insertHire, editHire, deletehire } = require("../modul/hire");

const hireControl = {
  getHire: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { rows: result } = await getHire(id);
      // delete result.password;
      res.status(200).json({
        message: `Worker List`,
        result,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"));
    }
  },
  insertHire: async (req, res, next) => {
    try {
      const idcompany = req.payload.id;
      const iduser = req.params.id;
      const { name, email, phonenumber, description, project } = req.body;
      const data = {
        name,
        email,
        phonenumber,
        description,
        project,
        iduser,
        idcompany,
      };
      await insertHire(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `data create success`,
      });
    } catch (error) {
      console.log(error);
    }
  },
  editHire: async (req, res, next) => {
    try {
      const id = req.body.id;
      // console.log(id);
      const { name, email, phonenumber, description, project, iduser, idcompany } = req.body;
      const data = {
        name,
        email,
        phonenumber,
        description,
        project,
        iduser,
        idcompany,
        id,
      };
      await editHire(data);
      console.log(data);
      res.status(200).json({
        data,
        message: `data update success`,
      });
    } catch (error) {
      console.log(error);
    }
  },
  deletehire: async (req, res, next) => {
    try {
      const id = req.body.id;
      console.log(id);
      await deletehire(id);
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
