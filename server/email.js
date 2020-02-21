const nodeMailer = require('nodemailer');

module.exports = {
    emailTemplate: (emailTo, subject, htmlBody) => {
        let transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        let mailOptions = {
            // from: email,
            to: emailTo,
            subject: subject,
            html: htmlBody // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
            // res.render('index');
        });
    }
}