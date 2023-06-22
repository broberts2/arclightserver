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
		await new Promise((r: any) => setTimeout(r, 4000));
		io.to(socket.id).emit(name, "success");
		return io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Please check your email for account finalization.`,
		});
	};
