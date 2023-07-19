module.exports =
	(modules: { [key: string]: any }) =>
	(Settings: any) =>
	async (M: { to: string; subject: string; text: string; html: string }) => {
		const Transporter = modules.Integrations.Mailer.Nodemailer.createTransport({
			host: Settings.apivalues.host,
			port: Settings.apivalues.port,
			secure: Settings.apivalues.secure,
			auth: Settings.apivalues.auth,
		});
		const Info = await Transporter.sendMail({
			from: Settings.apivalues.auth.user,
			to: M.to,
			subject: M.subject,
			text: M.text,
			html: M.html,
		});
	};
