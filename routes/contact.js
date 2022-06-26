const express = require("express");
const router = express.Router();
const app = require("../app");
const transporter = require("../config/Nodemailer");
require("dotenv/config");

router.post("/", async (req, res) => {
	const {
		name,
		email,
		subject,
		message,
		receiverEmail,
		receiverNickname,
		website,
	} = req.body.data;
	async function main() {
		// Envio, segun la conexion del Transport
		try {
			let contacto = await transporter.sendMail({
				from: process.env.EMAIL, // sender address
				to: receiverEmail, // list of receivers
				subject: "Nuevo contacto", // Subject line
				// Html
				html: `<p>¡Hola! te avisamos que alguien acaba de solicitar que te contactes en: ${website}</p>
						<div>
						<h3>Sus datos:</h3>
						<p>Nombre: ${name}</p>
						<p>E-Mail: ${email}</p>
						<p>Asunto: ${subject}</p> 
						<p>Mensaje: ${message}</p> 
						</div>`, // html body
			});
			res.status(200).json({ ok: true });
		} catch (error) {
			res.status(500).json({ error: error, ok: false });
		}
	}
	main().catch(console.error);
});

module.exports = router;
