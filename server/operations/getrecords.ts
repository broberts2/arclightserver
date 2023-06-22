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
				const index = msg.index;
				const recursive = msg._recursive;
				const limit = msg.search ? msg.search.limit : null;
				const sort = msg.search ? msg.search.sort : null;
				const skip = msg.search ? msg.search.skip : 0;
				if (msg.search) {
					delete msg.search.limit;
					delete msg.search.skip;
					delete msg.search.sort;
				}
				delete msg._recursive;
				delete msg.index;
				if (transforms.restrictions(io, socket, msg)) return;
				await modules.runScripts(
					"before-get",
					io,
					socket
				)({ msg, records: null });
				const totalcount = await modules._models[msg._model].count(msg?.search);
				const records = recursive
					? await modules
							.recursiveLookup(msg._model, msg?.search)
							.skip(skip)
							.limit(limit)
							.sort(sort)
					: await modules._models[msg._model]
							.find(msg?.search)
							.skip(skip)
							.limit(limit)
							.sort(sort);
				await modules.runScripts("after-get", io, socket)({ msg, records });
				return io.to(socket.id).emit(`${name}_${msg._model}`, {
					index,
					records,
					totalcount,
				});
			} catch (msg) {
				return io.to(socket.id).emit(`servererror`, {
					code: 503,
					msg,
				});
			}
		}
	};
