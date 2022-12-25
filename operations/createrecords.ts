const restrictions = (io: any, socket: any, msg: any) => {
	if (false)
		return io.to(socket.id).emit(`servererror`, {
			msg: `You do not have permissions to create these records.`,
			code: 403,
		});
};

export default (modules: { [key: string]: any }, name: string) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (restrictions(io, socket, msg)) return;
		const updateObj: { [key: string]: any } = {};
		Object.keys(msg).map((k: string) =>
			k.slice(0, 1) !== "_" ? (updateObj[k] = msg[k]) : null
		);
		const records = await modules._models[msg._model].insertMany(updateObj);
		io.to(socket.id).emit(`${name}_${msg._model}`, {
			[msg._model]: records,
			_triggerFetch: true,
		});
		io.to(socket.id).emit(`serversuccess`, {
			code: 201,
			msg: `Create successful.`,
		});
	};
