module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (transforms.restrictions(io, socket, msg)) return;
		const index = msg.index;
		delete msg.index;
		const limit = msg.search ? msg.search.limit : null;
		const skip = msg.search ? msg.search.skip : 0;
		if (msg.search) {
			delete msg.search.limit;
			delete msg.search.skip;
			delete msg.search.sort;
		}
		const records = await modules._models.model
			.find(msg?.search)
			.skip(skip)
			.limit(limit)
			.then((models: any) =>
				models.map((mod: any) => {
					const _: any = { _id: mod._id };
					Object.keys(mod)
						.filter(
							(m: string) => m !== "$isNew" && m !== "$__" && m !== "_doc"
						)
						.sort((a, b) => (a < b ? -1 : 1))
						.sort((a) => (typeof mod[a] !== "object" ? -1 : 1))
						.map((k: string) => (_[k] = mod[k]));
					return _;
				})
			);
		//const records = await modules._models.model.find();
		io.to(socket.id).emit(name, { records, index });
	};
