module.exports = (modules: { [key: string]: any }, publicURI: string) => {
	const _: {
		[key: string]:
			| Function
			| Array<{ permissions: Array<string>; fn: Function; name: string }>;
	} = {
		["riotgames-lolgamestats"]: async (record: any) =>
			await modules.Integrations["LoL Tournament API"].riotgamescallback(
				record
			),
		setup: async (Settings: any, fn: Function) => {
			return await Promise.all(
				["managestats", "manageendpoint", "manageapppermissions"].map(
					async (s: string) =>
						await modules.Integrations["LoL Tournament API"][s](Settings, fn)
				)
			);
		},
		onUpdate: async (Settings: any, fn: Function) => {
			return await Promise.all(
				["managestats", "manageendpoint", "manageapppermissions"].map(
					async (s: string) =>
						await modules.Integrations["LoL Tournament API"][s](Settings, fn)
				)
			);
		},
		onDeactivate: async (Settings: any, fn: Function) => {
			return await Promise.all(
				["managestats", "manageendpoint", "manageapppermissions"].map(
					async (s: string) =>
						await modules.Integrations["LoL Tournament API"][s](Settings, fn)
				)
			);
		},
		invokables: [
			{
				permissions: ["read"],
				name: "generatetournamentcodes",
				fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
					const Settings =
						require(`${modules.rootDirectory}/integrations.json`)[
							"LoL Tournament API"
						];
					await modules.Integrations[
						"LoL Tournament API"
					].generatetournamentcodes(Settings, msg, io, socket);
				},
			},
			{
				permissions: ["read"],
				name: "authenticatesummoner",
				fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
					const Settings =
						require(`${modules.rootDirectory}/integrations.json`)[
							"LoL Tournament API"
						];
					await modules.Integrations["LoL Tournament API"].authenticatesummoner(
						Settings,
						msg,
						io,
						socket
					);
				},
			},
			{
				permissions: ["read"],
				name: "importgamefromtournamentcode",
				fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
					const Settings =
						require(`${modules.rootDirectory}/integrations.json`)[
							"LoL Tournament API"
						];
					await modules.Integrations[
						"LoL Tournament API"
					].importgamefromtournamentcode(Settings, msg, io, socket);
				},
			},
		],
	};
	return _;
};