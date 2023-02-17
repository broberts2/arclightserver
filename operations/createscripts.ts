export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		if (transforms.restrictions(io, socket, msg)) return;
		//
		// CODE HERE
		//
		io.to(socket.id).emit(`serversuccess`, {
			code: 201,
			msg: `Create successful.`,
		});
	};
