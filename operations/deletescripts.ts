export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		//
		// CODE HERE
		//
		io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Delete successful.`,
		});
	};
