export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (modules._models[msg._model]) {
			try {
				if (transforms.restrictions(io, socket, msg)) return;
				await modules.runScripts("before-get");
				const records = await modules._models[msg._model].find(msg?.search);
				await modules.runScripts("after-get");
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
