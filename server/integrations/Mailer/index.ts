const Nodemailer = require("nodemailer");

module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function | Object } = {
		API: {},
		Nodemailer,
		setup: async (Settings: any) => {
			modules.Integrations.Mailer.API.send =
				modules.Integrations.Mailer.send(Settings);
		},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
