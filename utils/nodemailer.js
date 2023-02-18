const { createTransport } = require("nodemailer");

async function Mail(MAIL, PASS, html, asunto){
    try {
        const transporter = createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                type: "login",
                user: MAIL,
                pass: PASS
            }
        })
        
        const mailOptions = {
            from: 'servidor',
            to: MAIL,
            subject: asunto,
            html: html
        }
        const info = await transporter.sendMail(mailOptions)
        return info
    } catch (error) {
        console.log(error)
    }
}


module.exports = Mail