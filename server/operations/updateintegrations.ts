const _f =
	(io: any, socket: any, modules: any) =>
	async (record: string, s?: Object) => {
		if (modules && modules._models && modules._models[record]) {
			const records = await modules._models[record].find(s ? s : {});
			io.to(socket.id).emit(`getrecords_${record}`, records);
		}
	};

module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			const integrations = require(`${modules.rootDirectory}/integrations.json`);
			const prevActive = integrations[msg.integration].active;
			integrations[msg.integration] = JSON.parse(msg.value);
			modules.fs.writeFileSync(
				`${modules.rootDirectory}/integrations.json`,
				JSON.stringify(integrations),
				{
					encoding: "utf8",
				}
			);
			if (integrations[msg.integration].active) {
				if (!prevActive && modules.Integrations[msg.integration].setup)
					await modules.Integrations[msg.integration].setup(
						integrations[msg.integration],
						_f(io, socket, modules)
					);
				else if (modules.Integrations[msg.integration].onUpdate)
					await modules.Integrations[msg.integration].onUpdate(
						integrations[msg.integration],
						_f(io, socket, modules)
					);
			} else if (
				prevActive &&
				modules.Integrations[msg.integration].onDeactivate
			) {
				await modules.Integrations[msg.integration].onDeactivate(
					integrations[msg.integration],
					_f(io, socket, modules)
				);
			}
			io.to(socket.id).emit(`getintegrations`, integrations);
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
