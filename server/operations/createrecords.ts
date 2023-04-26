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
			try {
				await modules.runScripts(
					"before-create",
					io,
					socket
				)({ msg, records: null });
			} catch (e) {
				console.log(e);
				return;
			}
			const records = await modules._models[msg._model].insertMany(
				transforms.reduce(msg)
			);
			const _aftercreate = await modules._models[msg._model].find({
				_id: { $in: records.map((r: any) => r._id) },
			});
			try {
				await modules.runScripts(
					"after-create",
					io,
					socket
				)({ msg, records: _aftercreate });
			} catch (e) {
				console.log(e);
				return;
			}
			io.to(socket.id).emit(`${name}_${msg._model}`, {
				[msg._model]: records,
				_triggerFetch: true,
			});
			return io.to(socket.id).emit(`serversuccess`, {
				code: 201,
				msg: `Create successful.`,
			});
		} catch (msg) {
			return io.to(socket.id).emit(`servererror`, {
				code: 503,
				msg,
			});
		}
	};
