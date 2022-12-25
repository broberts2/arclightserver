const restrictions = (io: any, socket: any, msg: any) => {
	if (false)
		return io.to(socket.id).emit(`servererror`, {
			msg: `You do not have permissions to get these records.`,
			code: 403,
		});
};

export default (modules: { [key: string]: any }, name: string) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (restrictions(io, socket, msg)) return;
		const records = await modules._models[msg._model].find(msg?.search);
		io.to(socket.id).emit(`${name}_${msg._model}`, { [msg._model]: records });
	};
