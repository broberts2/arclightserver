export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(
		io: { [key: string]: any },
		socket: { [key: string]: any },
		operations: { [key: string]: any },
		msg: { [key: string]: any }
	) => {
		operations.authenticate(
			msg,
			(token: string) => {
				io.to(socket.id).emit(`savetoken`, {
					token,
				});
				return token;
			},
			() => io.to(socket.id).emit(`cleartoken`, {}),
			(msg: string) =>
				io.to(socket.id).emit(`serverwarning`, {
					code: 401,
					msg,
				}),
			(calls: { [key: string]: any }, token: string) => {
				io.to(socket.id).emit(
					name,
					operations.buildcallsockets(io, socket, operations, calls, token)
				);
			}
		);
	};
