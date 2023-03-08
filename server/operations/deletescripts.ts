export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: any) => {
		const value = JSON.parse(msg.value);
		["js", "json"].map((s: string) =>
			modules.fs.unlinkSync(
				`${__dirname}/../../scripts/${value.name.split(".")[0]}.${s}`
			)
		);
		modules.Scripts[msg.ctx][value.name] = undefined;
		io.to(socket.id).emit(`getscripts`, modules.Scripts);
		io.to(socket.id).emit(`serversuccess`, {
			code: 203,
			msg: `Delete successful.`,
		});
	};
