module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
	if (Settings.settings.desyncusers_on_deactivate) {
		await modules._models.user.deleteMany({
			_managed: "Discord",
		});
	}
	return await modules._models.profile.deleteMany({
		_managed: "Discord",
	});
};
