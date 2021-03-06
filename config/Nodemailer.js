const nodemailer = require("nodemailer");
require("dotenv/config");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	//465 puerto seguro SSL // 587, puerto default TLS
	secure: true, // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL, // user Mail
		pass: process.env.EMAIL_PASSWORD, // password user Mail
		//Para usar Gmail como servidor SMTP, debemos usar la cuenta como user, y generar una contrase;a de verificacion
		//https://myaccount.google.com/security
	},
});

module.exports = transporter;
