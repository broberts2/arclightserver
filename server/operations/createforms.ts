module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			const vars = msg.__template.split(".");
			const Template = JSON.parse(
				modules.fs.readFileSync(
					`${modules.rootDirectory}/forms/templates/${msg.__template}`,
					{
						encoding: "utf8",
					}
				)
			);
			delete msg.__template;
			Template.controls = Object.keys(msg).map((k: string) => ({
				...msg[k],
				type: k.split("_")[0],
			}));
			modules.fs.writeFileSync(
				`${modules.rootDirectory}/forms/documents/${vars[0]}/${vars[0]}_${
					modules.fs.readdirSync(
						`${modules.rootDirectory}/forms/documents/${vars[0]}`
					).length
				}.${vars[1]}`,
				JSON.stringify(Template),
				{
					encoding: "utf8",
				}
			);
			return io.to(socket.id).emit(`serversuccess`, {
				code: 202,
				msg: `Submission successful.`,
			});
		} catch (e: any) {
			io.to(socket.id).emit(`servererror`, {
				code: 500,
				msg: e.message,
			});
		}
	};
