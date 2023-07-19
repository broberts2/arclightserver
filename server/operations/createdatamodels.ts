module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (transforms.restrictions(io, socket, msg)) return;
		const record = await modules._models.model.create(
			transforms.reduce(msg, null, true)
		);
		await modules._buildModels();
		const adminProfileId = await modules._models.profile
			.findOne({
				name: "administrator",
			})
			.then((p: any) => p._id);
		await modules._models.permissions.create({
			_lookupmodel: record._id.toString(),
			name: record._type,
			create: [adminProfileId.toString()],
			read: [adminProfileId.toString()],
			edit: [adminProfileId.toString()],
			delete: [adminProfileId.toString()],
			ispublic: false,
		});
		io.to(socket.id).emit(`${name}_${msg._model}`, {
			[msg._model]: record,
			_triggerFetch: true,
		});
		io.to(socket.id).emit(`serversuccess`, {
			code: 201,
			msg: `Create successful.`,
		});
	};
