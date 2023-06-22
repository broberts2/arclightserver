module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			const beforeCreate = await modules.runScripts(
				"before-create",
				io,
				socket
			)({ msg, records: null });
			if (beforeCreate && !beforeCreate.success)
				throw new Error(`Script Error: ${beforeCreate.error}`);
			const records = await modules._models[msg._model].insertMany(
				transforms.reduce(msg)
			);
			const after = await modules._models[msg._model].find({
				_id: { $in: records.map((r: any) => r._id) },
			});
			const afterCreate = await modules.runScripts(
				"after-create",
				io,
				socket
			)({ msg, records: { after } });
			if (afterCreate && !afterCreate.success)
				throw new Error(`Script Error: ${afterCreate.error}`);
			io.to(socket.id).emit(`${name}_${msg._model}`, {
				[msg._model]: records,
				//_triggerFetch: true,
			});
			return io.to(socket.id).emit(`serversuccess`, {
				code: 201,
				msg: `Create successful.`,
			});
		} catch (msg) {
			console.log(msg);
			return io.to(socket.id).emit(`servererror`, {
				code: 503,
				msg,
			});
		}
	};
