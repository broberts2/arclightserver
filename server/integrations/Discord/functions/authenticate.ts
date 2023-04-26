module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
	if (Settings.apivalues.token) {
		await modules.Integrations.Discord.API.authenticate(
			Settings.apivalues.token
		);
		await modules.Integrations.Discord.API.getguild(
			Settings.settings.default_guild
		);
	}
};
