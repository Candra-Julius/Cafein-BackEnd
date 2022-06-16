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
            // text: `https://hire-job-app.herokuapp.com/v1/auth/activate/${token}/${data.id}`,
            html:`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
        body{
            font-family: sans-serif;
        }
        .container{
            margin:0 auto ;
            border-radius: 10px;
            margin-top: 40px;
            width: 80%;
            height: 500px;
            background-color: #E0E0E0;
            box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.4);
        }
        .header{
            border-radius: 10px 10px 0 0;
            width:100%;
            height: 110px;
            background-color:#5E50A1;
            text-align: center;
        }
        .header h1{
            color:#fff;
            display:block;
            padding: 35px;
        }
        .main{
            margin:0 auto;
            text-align: center;
            padding: 40px;
            width: 80%;
        }
        .button{
            margin:0 auto;
            width:230px;
            height:50px;
        background-color: #5E50A1;
        cursor: pointer;
        border-radius: 10px;
        box-shadow: 0 0 10px 4px rgba(0, 0, 0, 0.4);
        transition: 300ms;
        margin-top:30px;
        margin-bottom: 40px;
        }
        .button:hover{
            transform: translateY(-5px);
        }
        .ancor{
            display: flex;
            margin:0 auto;
            text-decoration: none;
            color:black
        }
    </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to HireJob</h1>
                    </div>
                    <div class="main">
                        <p>HI! </p>
                        <p>Click button bellow to activated your account</p>
                        <a class="ancor" href="https://hire-job-app.herokuapp.com/v1/auth/activate/${token}/${data.id}" target="_blank" rel="noopener">
                        <div  class="button" >
                            <p>Click Me!</p>
                        </div>
                        </a>
                        <p>Happy Working!</p>
                    </div>
                    
                </div>
            </body>
            </html>`
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
            text: `https://hire-job-app.herokuapp.com/v1/auth/forgot/${token}`,
        })
        console.log('Message sent: %s', info.messageId)
    },
    
}

module.exports = Mailing