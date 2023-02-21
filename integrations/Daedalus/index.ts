export default (
	modules: {
		[key: string]: any;
	},
	settings: { [key: string]: any }
) => {
	const _: { [key: string]: Function } = {
		setup: async (Settings: any) => {},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
