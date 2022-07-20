const createError = require("http-errors");
const {
  getProfile,
  getSkill,
  getPortofolio,
  editProfile,
  addSkill,
  getWorkExp,
  addWorkExp,
  addPortofolio,
  uploadAva,
  getALlProfileDefault,
  getAllProfile,
  search,
  searching,
  verifySkill,
  countProducts,
  countWorker,
} = require("../modul/worker");
const workerModel = require("../modul/worker");
const { response } = require("express");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const workerControl = {
  getProfile: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const {
        rows: [result],
      } = await getProfile(id);
      const { rows: skill } = await getSkill(id);
      const { rows: port } = await getPortofolio(id);
      const { rows: work } = await getWorkExp(id);
      const data = {
        ...result,
        skill,
        port,
        work,
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
  detailProfile: async (req, res, next) => {
    try {
      const id = req.params.id;
      const {
        rows: [result],
      } = await getProfile(id);
      const { rows: skill } = await getSkill(id);
      const { rows: port } = await getPortofolio(id);
      const { rows: work } = await getWorkExp(id);
      const data = {
        ...result,
        skill,
        port,
        work,
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
      const existSkill = await verifySkill(skill, id);
      console.log(existSkill);
      if (existSkill.rowCount) {
        res.status(200).json({
          message: "skill already exist",
        });
      } else {
        await addSkill(id, skill);
        res.status(200).json({
          message: "skill added",
          skill,
        });
      }
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  addWorkExp: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { position, companyname, date, desc } = req.body;
      const data = {
        id,
        position,
        companyname,
        date,
        desc,
      };
      await addWorkExp(data);
      res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  addPortofolio: async (req, res, next) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      const id = req.payload.id;
      const { aplicationname, repolink, portotype } = req.body;
      const data = {
        id,
        aplicationname,
        repolink,
        portotype,
        img: result.secure_url,
      };
      await addPortofolio(data);
      res.status(200).json({
        message: "succsess",
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  uploadAva: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const result = await cloudinary.uploader.upload(req.file.path);
      const data = {
        id,
        image: result.secure_url,
      };
      await uploadAva(data);
      res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  getAllProfile: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const order = req.query.order || "ASC";
      const sortby = req.query.sortby;
      const search = req.query.search;
      if (search) {
        const { rows } = await searching(search);
        const result = rows.map((data) => data.users_id);
        console.log(result);
        const hasil = await Promise.all(
          result.map(async (data) => {
            const dataProfile = await workerModel.getProfile(data).then((res) => {
              return res.rows[0];
            });
            // console.log(dataProfile);
            const dataSkill = await workerModel.getSkill(data).then((res) => {
              delete res.rows.users_id;
              return res.rows;
            });
            const val = {
              ...dataProfile,
              dataSkill,
            };
            return val;
          })
        );
        const {
          rows: [count],
        } = await countWorker();
        const totalData = parseInt(count.total);
        totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit,
          totalData,
          totalPage,
        };
        res.status(200).json({
          message: "success",
          pagination,
          hasil,
        });
      } else {
        if (sortby) {
          const { rows } = await getAllProfile(sortby, order, limit, offset);
          const ids = rows.map((data) => data.iduser);
          const result = await Promise.all(
            ids.map(async (data) => {
              const dataProfile = await getAllProfile(sortby, order, limit, offset).then((res) => {
                return res.rows[0];
              });
              const dataSkill = await workerModel.getSkill(data).then((res) => {
                return res.rows;
              });
              const val = {
                ...dataProfile,
                dataSkill,
              };
              return val;
            })
          );
          const {
            rows: [count],
          } = await countWorker();
          const totalData = parseInt(count.total);
          totalPage = Math.ceil(totalData / limit);
          const pagination = {
            currentPage: page,
            limit,
            totalData,
            totalPage,
          };
          res.status(200).json({
            message: "success",
            pagination,
            hasil,
          });
        } else {
          const { rows } = await getALlProfileDefault(limit, offset);
          const ids = rows.map((data) => data.iduser);
          const hasil = await Promise.all(
            ids.map(async (data) => {
              const dataProfile = await getALlProfileDefault(limit, offset).then((res) => {
                return res.rows[0];
              });
              const dataSkill = await workerModel.getSkill(data).then((res) => {
                return res.rows;
              });
              // console.log(dataProfile);
              const val = {
                ...dataProfile,
                dataSkill,
              };
              console.log(val);
              return val;
            })
          );
          const {
            rows: [count],
          } = await countWorker();
          const totalData = parseInt(count.total);
          totalPage = Math.ceil(totalData / limit);
          const pagination = {
            currentPage: page,
            limit,
            totalData,
            totalPage,
          };
          res.status(200).json({
            message: "success",
            pagination,
            hasil,
          });
        }
      }
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
};
module.exports = workerControl;
