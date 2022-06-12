const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    requireTLS: true,
    auth: {
        user: 'HireJobTeamCafein@gmail.com',
        pass: process.env.GMAIL_APP_PASS
    }
})
const Mailing = {
    accActivation: async (data) => {
        const token = jwt.sign(data, process.env.SECRET_KEY_JWT, {
            expiresIn: '1 week'
            })
        const info = await transporter.sendMail({
            from: '"HireJob"<HireJobTeamCafein@gmail.com>',
            to: data.email,
            subject: 'Email Verification',
            text: `http://localhost:2000/v1/auth/activate/${token}/${data.id}`,
        })
        console.log('Message sent: %s', info.messageId)
    },
    forgotPassword: async (data) => {
        const expiresIn = {
            expiresIn: '1h',
            issuer: 'HireJob'
        }
        const token = jwt.sign(data, process.env.SECRET_KEY_JWT, expiresIn)
        const info = await transporter.sendMail({
            from: '"HireJob"<HireJobTeamCafein@gmail.com>',
            to: data.email,
            subject: 'Reset Pasword',
            text: `http://localhost:2000/v1/auth/forgot/${token}`,
        })
        console.log('Message sent: %s', info.messageId)
    },
    
}

module.exports = Mailing