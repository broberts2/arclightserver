export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			const value = JSON.parse(msg.value);
			["js", "json"].map((s: string, i: number) =>
				modules.fs.writeFileSync(
					`scripts/${value.name.split(".")[0]}.${s}`,
					i ? JSON.stringify(value) : `async (ServerObject) => {\n\n};`,
					{
						encoding: "utf8",
					}
				)
			);
			if (!modules.Scripts) modules.Scripts = {};
			if (!modules.Scripts[msg.ctx]) modules.Scripts[msg.ctx] = {};
			modules.Scripts[msg.ctx][value.name] = {
				metadata: JSON.stringify(value),
				fn: `async (ServerObject) => {

				};
				`,
			};
			io.to(socket.id).emit(`getscripts`, modules.Scripts);
			return io.to(socket.id).emit(`serversuccess`, {
				code: 202,
				msg: `Create successful.`,
			});
		} catch (e: any) {
			io.to(socket.id).emit(`servererror`, {
				code: 500,
				msg: e.message,
			});
		}
	};
