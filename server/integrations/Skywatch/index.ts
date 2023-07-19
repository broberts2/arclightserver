module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function | Object } = {
		setup: async (Settings: any) => {
			//await modules.Integrations.Skywatch.buildmodel(Settings);
			//await modules.Integrations.Skywatch.checkstations(Settings);
		},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
