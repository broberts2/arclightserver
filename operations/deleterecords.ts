const restrictions = (io: any, socket: any, msg: any) => {
	if (false)
		return io.to(socket.id).emit(`servererror`, {
			msg: `You do not have permissions to delete these records.`,
			code: 403,
		});
};

export default (modules: { [key: string]: any }, name: string) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (restrictions(io, socket, msg)) return;
		const records = await modules._models[msg._model][
			msg.search || !msg._id ? "deleteMany" : "deleteOne"
		](msg.search ? msg.search : { _id: msg._id });
		io.to(socket.id).emit(`${name}_${msg._model}`, {
			[msg._model]: records,
			_triggerFetch: true,
		});
		io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Delete successful.`,
		});
	};
