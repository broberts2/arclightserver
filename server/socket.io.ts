const transforms = require("./transforms");
const _fs = require("fs");

module.exports = (
	server: any,
	port: number,
	modules: { [key: string]: any }
) => {
	server.listen(port, () => {
		console.log(
			`⚡️ Arclight Server is running at http://localhost:${port}  ⚡️`
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
	_fs
		.readdirSync(`${__dirname}/operations`)
		.map(
			(e: string) =>
				(operations[e.split(".")[0]] = require(`${__dirname}/operations/${e}`)(
					modules,
					e.split(".")[0],
					transforms(modules._buildModels)
				))
		);
	_fs
		.readdirSync(`${__dirname}/events`)
		.map((e: string) => require(`${__dirname}/events/${e}`)(io, operations));
	modules.buildIntegrations();
	return server;
};
