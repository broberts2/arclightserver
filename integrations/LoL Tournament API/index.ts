export default (modules: { [key: string]: any }) => {
	const _: { [key: string]: Function } = {
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
