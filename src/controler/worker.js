const jwt = require('jsonwebtoken')
const createError = require('http-errors') 
const { getProfile, getSkill, getPortofolio, editProfile, addSkill, getWorkExp, addWorkExp, addPortofolio, uploadAva, getALlProfileDefault, getAllProfile } = require('../modul/worker');
const workerModel = require('../modul/worker');
const  cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const workerControl = {
    getProfile: async(req, res, next) => {
        try {
            const id = req.payload.id
            const {rows: [result]} = await getProfile(id)
            const {rows: skill} = await getSkill(id)
            const {rows: port} = await getPortofolio(id)
            const {rows: work} = await getWorkExp(id)
            const data = {
                ...result,
                skill,
                port,
                work
            }
            delete data.password
            res.status(200).json({
                message: `wellcome ${result.fullname}`,
                data
            })
        } catch (error) {
            console.log(error);
            next(createError[500]('internal server error'))
        }
    },
    editProfile: async(req, res, next) => {
        try {
            const id = req.payload.id
        console.log(id);
        const {fullname, jobdesk, address, workplace, description} = req.body
        const data = {
            id,
            fullname,
            jobdesk,
            address,
            workplace,
            description,
        }
        await editProfile(data)
        res.status(200).json({
            data
        })
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
        
    },
    addSkill: async(req,res,next) => {
        try {
            const id = req.payload.id
            const {skill} = req.body
            console.log(id);
            console.log(skill);
            await addSkill(id, skill)
        res.status(200).json({
            message: 'skill added',
            skill
        })
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
        
    },
    addWorkExp: async(req, res, next) => {
        try {
            const id = req.payload.id
            const {position, companyname, date, desc} = req.body
            const data = {
                id,
                position,
                companyname,
                date,
                desc
            }
            await addWorkExp(data)
            res.status(200).json({
                message: 'success',
                data
            })
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
    },
    addPortofolio: async(req, res, next) => {
        try {
            const result = await cloudinary.uploader.upload(req.file.path)
            const id = req.payload.id
            const {aplicationname, repolink, portotype} = req.body
            const data = {
                id,
                aplicationname,
                repolink,
                portotype,
                img: result.secure_url
            }
            await addPortofolio(data)
            res.status(200).json({
                message: 'succsess',
                data
            })
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
    },
    uploadAva: async (req, res, next) =>{
        try {
            const id = req.payload.id
            const result = await cloudinary.uploader.upload(req.file.path)
            const data = {
                id,
                image: result.secure_url
            }
            await uploadAva(data)
            res.status(200).json({
                message: 'success',
                data
            })
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
    },
    getAllProfile: async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 12
            const offset = (page - 1) * limit
            const order = req.query.order || 'ASC'
            const sortby = req.query.sortby
            const search = req.query.search
            if (search){
                const {rows} = await workerModel.search(search) 
                res.status(200).json({
                    message: 'success',
                    rows
                })
            }else {
                if (sortby){
                const {rows} = await getAllProfile(sortby, order, limit, offset)
                res.status(200).json({
                    message: 'success',
                    rows
                })
            }else {
                const {rows} = await getALlProfileDefault(limit, offset)
                res.status(200).json({
                    message: 'success',
                    rows
                })
            }
            }
            
        } catch (error) {
            console.log(error);
            next(createError[500]('Internal Server Error'))
        }
    }
}

module.exports = workerControl