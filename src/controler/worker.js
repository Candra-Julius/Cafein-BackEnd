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
  searching,
  verifySkill,
  countWorker,
  editAllProfile,
  getHire,
  editHire,
  getAllProfileWithSort,
  deleteSkill,
  checkSkill,
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
      const file = req.file;
      if (file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        const data = {
          id,
          fullname,
          jobdesk,
          address,
          workplace,
          description,
          image: result.secure_url,
        };
        await editAllProfile(data);
        res.status(200).json({
          data,
        });
      } else {
        const data = {
          id,
          fullname,
          jobdesk,
          address,
          workplace,
          description,
          // image: result.secure_url
        };
        console.log(data);
        await editProfile(data);
        res.status(200).json({
          data,
        });
      }
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
  getAllProfile: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const offset = (page - 1) * limit;
      const order = req.query.order || "ASC";
      const sortby = req.query.sortby;
      const search = req.query.search;

      if(search && sortby){

        const { rows } = await searching(search);
        const ids = rows.map((data) => data.users_id);
        const data = await Promise.all(ids.map(async(datas) => {
            return (profile = await getAllProfileWithSort(datas, sortby, order, limit, offset).then((res) => {
                return res.rows
            }))
        }))
        const hasil = await Promise.all(
            ids.map(async (data) => {
              return ([dataSkill] = await workerModel
                .getSkill(data)
                .then((res) => {
                  return res.rows;
                }));
            })
          );
          let datas;
          let skill = {};
          let val = [];
          for (let i = 0; i < data.length; i++) {
            datas = data[i];
            skill = hasil[i].map((item) => item.skillname);
            val.push({
              ...datas[0],
              skill,
            });
          }
          const totalData = ids.length
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
            val,
          });
      }else if (search) {
        const { rows } = await searching(search);
        const ids = rows.map((data) => data.users_id);
        const data = await Promise.all(ids.map(async(datas) => {
            return (profile = await getProfile(datas).then((res) => {
                return res.rows
            }))
        })) 
        const hasil = await Promise.all(
            ids.map(async (data) => {
              return ([dataSkill] = await workerModel
                .getSkill(data)
                .then((res) => {
                  return res.rows;
                }));
            })
          );
          let datas;
          let skill = {};
          let val = [];
          for (let i = 0; i < data.length; i++) {
            datas = data[i];
            skill = hasil[i].map((item) => item.skillname);
            val.push({
              ...datas[0],
              skill,
            });
          }
          const totalData = ids.length
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
            val,
          });
      } else {
        if (sortby) {
          const { rows } = await getAllProfile(sortby, order, limit, offset);
          const ids = rows.map((data) => data.iduser);
          const hasil = await Promise.all(
            ids.map(async (data) => {
              return ([dataSkill] = await workerModel
                .getSkill(data)
                .then((res) => {
                  return res.rows;
                }));
            })
          );
          let datas;
          let skill = {};
          let val = [];
          for (let i = 0; i < rows.length; i++) {
            datas = rows[i];
            skill = hasil[i].map((item) => item.skillname);
            val.push({
              ...datas,
              skill,
            });
          }
          console.log(val);
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
            val,
          });
        } else {
          const { rows: data } = await getALlProfileDefault(limit, offset);
          const ids = data.map((data) => data.iduser);
          const hasil = await Promise.all(
            ids.map(async (data) => {
              return ([dataSkill] = await workerModel
                .getSkill(data)
                .then((res) => {
                  return res.rows;
                }));
            })
          );
          let datas;
          let skill = {};
          let val = [];
          for (let i = 0; i < data.length; i++) {
            datas = data[i];
            skill = hasil[i].map((item) => item.skillname);
            val.push({
              ...datas,
              skill,
            });
          }
          console.log(val);
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
            val,
          });
        }
        }
    } catch (error) {
      console.log(error);
      next(createError[500]("Internal Server Error"));
    }
  },
  getHire: async (req, res, next) => {
    try {
      const id = req.payload.id;
      const { rows: result } = await getHire(id);
      // delete result.password;
      console.log("worker hire", result);
      res.status(200).json({
        message: `Company Call for you`,
        result,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"));
    }
  },
  editHire: async (req, res, next) => {
    try {
      const { status, id } = req.body;
      const data = {
        status,
        id,
      };
      await editHire(data);
      console.log(data);

      res.status(200).json({
        data,
        message: `data hire update success`,
      });
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"))
    }
  },
  deleteSkill: async(req, res, next) => {
    try {
      const name = req.params.name
      const id = req.payload.id
      const data = {
        name,
        id
      }
      const {rowCount} = await checkSkill(data)
      if(!rowCount){
        res.status(400).json({
          message: 'data doesnt exist'
        })
      }else{
      await deleteSkill(data)
      res.status(200).json({
        message: 'Skill deleted',
        data
      })
      }
    } catch (error) {
      console.log(error);
      next(createError[500]("internal server error"))
    }
  }
};

module.exports = workerControl;
