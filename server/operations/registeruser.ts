const EXPIRE_MIN = 15;

module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		const R = await modules._models.settings.findOne({ name: "default" });
		if (!R.userregistration) return;
		const U = await modules._models.user.insertMany({
			username: msg.username,
			_password: modules.Cryptr.encrypt(msg.password),
			email: msg.email,
			_unverified: true,
		});
		const url = btoa(
			JSON.stringify({
				id: U[0]._id,
				p: modules.Cryptr.encrypt(msg.password),
			})
		);
		await modules.Integrations.Mailer.API.send({
			to: msg.email,
			subject: `${msg.username} Account Verification`,
			html: `<body>
						<h1>Please click the link below to activate your account:</h1>
						<a href="${msg.redirect}?v=${url}">${msg.redirect}?v=${url}</a>
						<br />
						<p>Link will expire after ${EXPIRE_MIN} minutes.</p>
					</body>`,
		});
		io.to(socket.id).emit(name, "success");
		setTimeout(() => {
			modules._models.user.deleteOne({
				_id: U._id,
				_unverified: true,
			});
		}, EXPIRE_MIN * 60000);
		return io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Please check your email for account finalization.`,
		});
	};
