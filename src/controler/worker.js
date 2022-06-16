const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { getProfile, getSkill, getPortofolio, editProfile, addSkill } = require("../modul/worker");

const workerControl = {
  getProfile: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const {
        rows: [result],
      } = await getProfile(id);
      const { rows: skill } = await getSkill(id);
      const { rows: port } = await getPortofolio(id);
      const data = {
        ...result,
        skill,
        port,
      };
      delete data.password;
      res.status(200).json({
        message: `wellcome ${result.fullname}`,
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"));
    }
  },
  editProfile: async (req, res, next) => {
    try {
      const id = req.payload.id;
      console.log(id);
      const { fullname, jobdesk, address, workplace, description } = req.body;
      const data = {
        id,
        fullname,
        jobdesk,
        address,
        workplace,
        description,
      };
      await editProfile(data);
      res.status(200).json({
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  addSkill: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { skill } = req.body;
      console.log(id);
      console.log(skill);
      await addSkill(id, skill);
      res.status(200).json({
        message: "skill added",
        skill,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
};

module.exports = workerControl;
