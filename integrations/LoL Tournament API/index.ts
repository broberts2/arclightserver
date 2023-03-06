export default (modules: { [key: string]: any }) => {
	const _: { [key: string]: Function } = {
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
	};
	return _;
};
