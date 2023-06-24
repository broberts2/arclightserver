module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function | Object } = {
		setup: async (Settings: any) => {
			modules.Integrations.Skywatch.buildstations(Settings);
		},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
