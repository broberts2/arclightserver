export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (transforms.restrictions(io, socket, msg)) return;
		await modules.runScripts("before-create");
		const records = await modules._models[msg._model].insertMany(
			transforms.reduce(msg)
		);
		io.to(socket.id).emit(`${name}_${msg._model}`, {
			[msg._model]: records,
			_triggerFetch: true,
		});
		await modules.runScripts("after-create");
		io.to(socket.id).emit(`serversuccess`, {
			code: 201,
			msg: `Create successful.`,
		});
	};
