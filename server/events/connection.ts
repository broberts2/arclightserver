module.exports = (
	io: { [key: string]: any },
	operations: { [key: string]: any }
) =>
	io.on("connection", (socket: { [key: string]: any }) => {
		["authenticate", "join"].map((str: string) =>
			socket.on(str, (msg: { [key: string]: any }) =>
				operations.init(io, socket, operations, msg)
			)
		);
		socket.on(`signout`, operations.signout(io, socket));
	});
