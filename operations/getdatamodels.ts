const restrictions = (io: any, socket: any, msg: any) => {
	if (false)
		return io.to(socket.id).emit(`servererror`, {
			msg: `You do not have permissions to access data models.`,
			code: 403,
		});
};

export default (modules: { [key: string]: any }, name: string) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (restrictions(io, socket, msg)) return;
		const models = await modules._models.model.find();
		io.to(socket.id).emit(name, models);
	};
