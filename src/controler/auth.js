const authModel =require('../modul/auth')
const jwt = require('jsonwebtoken')
const webToken = require('../helper/jwt')
const { v4: uuidv4 } = require('uuid')
const createError = require('http-errors')
const bcrypt = require('bcryptjs')
const {accActivation, forgotPassword} = require('../helper/mailer')
const { checkIdworker, activate, resetPassword } = require('../modul/auth')

const authControl = {
    login:async (req, res, next)=>{
    try {
        const {email, password} =  req.body
        //checkemail from worker tabel
        const {rowCount: worker, rows: [dataW]} = await authModel.checkEmailWorker(email)
        console.log( dataW);
        //checkemail from employee tabel
        const {rowCount: employee, rows: [dataE]} = await authModel.checkEmailEmploy(email)
        console.log(`employee: ${employee}`);
            if(worker) {
                const passvalidate = bcrypt.compareSync(password, dataW.password)
                if (!passvalidate){
                    res.status(403).json({
                        message: 'Wrong email or password'
                    })
                }else{
                    const payload = {
                        id: dataW.iduser,
                        email: dataW.email,
                        role: dataW.role,
                        status: dataW.status
                    }
                    if (payload.status !== 'active'){
                        res.status(400).json({
                            message: 'please check your email to activate your account'
                        })
                    }else{
                        dataW.token = webToken.generateToken(payload)
                        dataW.refreshToken = webToken.generateRefreshToken(payload)
                        delete dataW.password
                        res.status(200).json({
                            message: `Welcome ${dataW.fullname}`,
                            data: payload,
                            token: dataW.token,
                            refreshToken:dataW.refreshToken
                        })
                    }
                }
            }else if(employee) {
                const passvalidate = bcrypt.compareSync(password, dataE.password)
                if(!passvalidate) {
                res.status(403).json({
                    message: 'Wrong email or password'
                })
                }else {
                    const payload = {
                        id: dataE.idcompany,
                        email: dataE.email,
                        role: dataE.role,
                        status: dataE.status
                    }
                    if(payload.status !== 'active'){
                        res.status(400).json({
                            message: 'please check your email to activate your account'
                        })
                    }else {
                    dataE.token = webToken.generateToken(payload)
                    dataE.refreshToken = webToken.generateRefreshToken(payload)
                    delete dataE.password
                        res.status(200).json({
                            message: `Welcome ${dataE.fullname}`,
                            data: payload,
                            token: dataE.token,
                            refreshToken: dataE.refreshToken
                        })
                    }
                } 
            }else{
                res.status(403).json({
                    message: 'Wrong email or password'
                })
            }
        } catch (error) {
        console.log(error);
        next(createError[500]())
    }
    },
    registerWorker: async(req, res, next)=>{
        try {
            console.log(req.body);
        const {email, fullname, password, phone} = req.body
        const {rowCount: workRow} = await authModel.checkEmailWorker(email)
        // console.log(result);
        const {rowCount: employRow} = await authModel.checkEmailEmploy(email)
        // console.log(res);
        if(workRow | employRow) {
            return next(createError[403]('Email already taken'))
        } else{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password,salt)
            const data = {
                id: uuidv4(),
                fullname,
                email,
                phone,
                hash,
                role: 'Worker',
                status: 'inactive'
            } 
            //from nodemailer
            accActivation(data)
            //input to worker tabel
            await authModel.workRegis(data)
            res.status(201).json({
                message: 'Your account has been created. please check your email to activate your account'
            })
        }
        } catch (error) {
            console.log(error);
            next(createError[500]('internal server error'))
        }
        
    },
    registerEmp: async(req, res, next)=>{
        try {
            const { email, password, fullname, phone, companyName, position} = req.body
        const {rowCount: workRow} = await authModel.checkEmailWorker(email)
        const {rowCount: employRow} = await authModel.checkEmailEmploy(email)
        if(workRow | employRow) {
            next(createError[403]('Email already taken'))
        }else{
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password,salt)
            const data = {
                id: uuidv4(),
                fullname,
                email,
                phone,
                companyName,
                position,
                hash,
                role: 'Recruiter',
                status: 'inactive'
            } 
            accActivation(data)
            await authModel.empRegis(data)
            res.status(201).json({
                message: 'Your account has been created. please check your email to activate your account'
            })
        }
        } catch (error) {
            console.log(error);
            next(createError[500]('internal server error'))
        }
    },
    activation: async (req, res, next) => {
        try {
            // const token = req.params.token
            const id = req.params.id
            const strId = id.toString()
        const {rowCount: worker} = await checkIdworker(id)
        console.log(worker);
        if(worker){
            const route = 'users'
            const idname = 'iduser'
            console.log(route);
            await activate(route, idname,strId)
            res.status(200).json({
                message: 'account activated'
            })
        }else {
            const route = 'company'
            const idname = 'idcompany'
            console.log(route);
            console.log(idname);
            await activate(route, idname, strId)
            res.status(200).json({
                message: 'account activated'
            })
        }
        } catch (error) {
            console.log(error);
            next(createError[500]('Something Wrong'))
        }
        
    },
    forgotPassword: async(req, res, next)=>{
        try {
            const {email} = req.body
            const data = {
                email
            }
            const {rowCount: workRow} = await authModel.checkEmailWorker(email)
            const {rowCount: employRow} = await authModel.checkEmailEmploy(email)
            if(!workRow && !employRow){
                next(createError[400]('Email doesn\'t exist'))
            }else{
                await forgotPassword(data)
                res.status(200).json({
                    message: 'check your email'
                })
            }
        } catch (error) {
            console.log(error);
            next(createError[500]('internal server error'))
        }
    },
    resetPassword: async(req, res, next) => {
        try {
            const {email} = jwt.decode(req.params.token)
            console.log(email);
            const {rowCount: workCount} = await authModel.checkEmailWorker(email)
            const {rowCount: employRow} = await authModel.checkEmailEmploy(email)
            if(workCount){
                const route = 'users'
                console.log(route);
                const {password} = req.body
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password,salt)
                await resetPassword(route, hash, email)
                res.status(200).json({
                    message: 'password updated'
                })
            }else if (employRow){
                const route = 'company'
                const {password} = req.body
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password,salt)
                await resetPassword(route, hash, email)
                res.status(200).json({
                    message: 'password updated'
                })
            }else{
                res.status(400).json({
                    message: 'Account doesn\'t exist'
                })
            }
        } catch (error) {
            console.log(error);
            next(createError[500]('somethong\'s wrong'))
        }
    }

}

module.exports = authControl