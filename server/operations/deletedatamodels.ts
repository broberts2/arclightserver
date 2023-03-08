export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (transforms.restrictions(io, socket, msg)) return;
		const record = await modules._models.model.findOne(
			msg.search ? msg.search : { _id: msg._id }
		);
		const rs = await modules._models[record._type].find();
		if (rs.length)
			return io.to(socket.id).emit(`servererror`, {
				code: 503,
				msg: `Dependency error. Before deleting this model, first delete all ${record.text} records.`,
			});
		const permissions = await modules._models.permissions.find();
		await modules._models.model.deleteOne({ _id: record._id });
		const _prms = permissions.find((p: any) =>
			p._lookupmodel
				? p._lookupmodel.toString() === record._id.toString()
				: null
		);
		if (_prms && _prms._id)
			await modules._models.permissions.deleteOne({
				_id: _prms._id,
			});
		io.to(socket.id).emit(`${name}_${msg._model}`, {
			[msg._model]: record,
			_triggerFetch: true,
		});
		io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Delete successful.`,
		});
	};
