export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			await modules.runScripts("before-delete", io, socket)(msg);
			const records = await modules._models[msg._model][
				msg.search || !msg._id ? "deleteMany" : "deleteOne"
			](msg.search ? msg.search : { _id: msg._id });
			io.to(socket.id).emit(`${name}_${msg._model}`, {
				[msg._model]: records,
				_triggerFetch: true,
			});
			await modules.runScripts("after-delete", io, socket)(msg);
			io.to(socket.id).emit(`serversuccess`, {
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
