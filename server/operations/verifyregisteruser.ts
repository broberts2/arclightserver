module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		const R = await modules._models.settings.findOne({ name: "default" });
		if (!R || !R.userregistration) return;
		let DSel;
		try {
			DSel = JSON.parse(atob(msg.v));
		} catch (e) {
			return io.to(socket.id).emit(`servererror`, {
				code: 401,
				msg: `Malformed token.`,
			});
		}
		console.log(DSel);
		const U = await modules._models.user.findOne({
			_id: DSel.id,
			_unverified: true,
		});
		if (!U)
			return io.to(socket.id).emit(`servererror`, {
				code: 400,
				msg: `Sign-up link invalid or expired.`,
			});
		const auth = msg.password === modules.Cryptr.decrypt(DSel.p);
		if (!auth)
			return io.to(socket.id).emit(`servererror`, {
				code: 403,
				msg: `User password was incorrect.`,
			});
		await modules._models.user.updateOne(
			{ _id: U._id },
			{ $unset: { _unverified: true } }
		);
		io.to(socket.id).emit(`clearurlparameters`);
		return io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `User registration successful.`,
		});
	};
