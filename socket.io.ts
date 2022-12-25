const fs = require("fs");

const SocketIO = (server: any, port: number, modules: Object) => {
	server.listen(port, () => {
		console.log(
			`⚡️Arclight Server is running at http://localhost:${port} ⚡️`
		);
	});
	const io = require("socket.io")(server, {
		cors: {
			origin: "*",
		},
	});
	const operations: {
		[key: string]: Function;
	} = {};
	fs.readdirSync(`${__dirname}/operations`).map(
		(e: string) =>
			(operations[e.split(".")[0]] =
				require(`${__dirname}/operations/${e}`).default(
					modules,
					e.split(".")[0],
					{}
				))
	);
	fs.readdirSync(`${__dirname}/events`).map((e: string) =>
		require(`${__dirname}/events/${e}`).default(io, operations)
	);
	return server;
};

export default SocketIO;
