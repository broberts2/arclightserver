module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			const name =
				msg.type !== "Script Logic"
					? JSON.parse(msg.value).name.split(".")[0]
					: msg.script;
			const b =
				msg.type !== "Script Logic" &&
				JSON.parse(msg.value).name !== `${msg.script}.js`;
			if (b)
				["json", "js"].map((s: string) =>
					modules.fs.renameSync(
						`${modules.rootDirectory}/scripts/${msg.ctx}/${msg.script}.${s}`,
						`${modules.rootDirectory}/scripts/${msg.ctx}/${name}.${s}`
					)
				);
			modules.fs.writeFileSync(
				`${modules.rootDirectory}/scripts/${msg.ctx}/${name}.${
					msg.type === "Script Logic" ? "js" : "json"
				}`,
				msg.value,
				{
					encoding: "utf8",
				}
			);
			if (b) {
				modules.Scripts[msg.ctx][name] = modules.Scripts[msg.ctx][msg.script];
				delete modules.Scripts[msg.ctx][msg.script];
			}
			modules.Scripts[msg.ctx][name][
				msg.type === "Script Logic" ? "fn" : "metadata"
			] = msg.value;
			io.to(socket.id).emit(`getscripts`, modules.Scripts);
			return io.to(socket.id).emit(`serversuccess`, {
				code: 202,
				msg: `Update successful.`,
			});
		} catch (e: any) {
			io.to(socket.id).emit(`servererror`, {
				code: 500,
				msg: e.message,
			});
		}
	};
