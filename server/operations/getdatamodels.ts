module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (transforms.restrictions(io, socket, msg)) return;
		// const models = await modules._models.model.find().then((models: any) =>
		// 	models.map((m: any) => {
		// 		const _: any = {};
		// 		Object.keys(m)
		// 			.sort((a, b) => (a < b ? -1 : 1))
		// 			.map((k: string) => (_[k] = m[k]));
		// 		return _;
		// 	})
		// );
		const models = await modules._models.model.find();
		io.to(socket.id).emit(name, models);
	};
