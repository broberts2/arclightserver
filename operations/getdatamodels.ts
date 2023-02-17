export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		if (transforms.restrictions(io, socket, msg)) return;
		const models = await modules._models.model.find();
		io.to(socket.id).emit(name, models);
	};
