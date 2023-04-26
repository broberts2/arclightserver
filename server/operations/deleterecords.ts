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
			const _beforedelete = await modules._models[msg._model].find({
				_id: { $in: [msg._id] },
			});
			try {
				await modules.runScripts(
					"before-delete",
					io,
					socket
				)({ msg, records: _beforedelete });
			} catch (e) {
				console.log(e);
				return;
			}
			const records = await modules._models[msg._model][
				msg.search || !msg._id ? "deleteMany" : "deleteOne"
			](msg.search ? msg.search : { _id: msg._id });
			try {
				await modules.runScripts("after-delete", io, socket)({ msg, records });
			} catch (e) {
				console.log(e);
				return;
			}
			io.to(socket.id).emit(`${name}_${msg._model}`, {
				[msg._model]: records,
				_triggerFetch: true,
			});
			return io.to(socket.id).emit(`serversuccess`, {
				code: 203,
				msg: `Delete successful.`,
			});
		} catch (msg) {
			return io.to(socket.id).emit(`servererror`, {
				code: 503,
				msg,
			});
		}
	};
