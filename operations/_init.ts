export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	async (
		io: { [key: string]: any },
		socket: { [key: string]: any },
		calls: { [key: string]: any }
	) => {
		io.to(socket.id).emit(name, calls);
	};
