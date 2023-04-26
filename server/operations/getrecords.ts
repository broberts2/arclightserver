module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (modules._models[msg._model]) {
			try {
				const recursive = msg._recursive;
				delete msg._recursive;
				if (transforms.restrictions(io, socket, msg)) return;
				try {
					await modules.runScripts(
						"before-get",
						io,
						socket
					)({ msg, records: null });
				} catch (e) {
					console.log(e);
					return;
				}
				const records = recursive
					? await modules.recursiveLookup(msg._model, msg?.search)
					: await modules._models[msg._model].find(msg?.search);
				try {
					await modules.runScripts("after-get", io, socket)({ msg, records });
				} catch (e) {
					console.log(e);
					return;
				}
				return io.to(socket.id).emit(`${name}_${msg._model}`, {
					[msg._model]: records,
				});
			} catch (msg) {
				return io.to(socket.id).emit(`servererror`, {
					code: 503,
					msg,
				});
			}
		}
	};
