export default (
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			const integrations = require(`../integrations.json`);
			const prevActive = integrations[msg.integration].active;
			integrations[msg.integration] = JSON.parse(msg.value);
			modules.fs.writeFileSync(
				`${__dirname}/../integrations.json`,
				JSON.stringify(integrations),
				{
					encoding: "utf8",
				}
			);
			if (
				!prevActive &&
				integrations[msg.integration].active &&
				modules.Integrations[msg.integration].setup
			)
				await modules.Integrations[msg.integration].setup();
			io.to(socket.id).emit(`getintegrations`, {
				_triggerFetch: true,
			});
			io.to(socket.id).emit(`serversuccess`, {
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
