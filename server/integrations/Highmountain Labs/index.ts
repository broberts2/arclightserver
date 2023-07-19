module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function } = {
		setup: async (Settings: any) => {},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
