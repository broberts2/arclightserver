module.exports = (Modules: any, publicURI: string) => async (Settings: any) => {
	const P = await Modules._models.permissions.findOne({
		name: "(M) Discord",
	});
	if (!P && Settings.app && Settings.app.active) {
		const adminProfileId = await Modules._models.profile
			.findOne({
				name: "administrator",
			})
			.then((p: any) => p._id);
		await Modules._models.permissions.insertMany({
			_system: true,
			_managed: "Discord",
			_lookupmodel: undefined,
			_app: true,
			name: "(M) Discord",
			create: [adminProfileId],
			read: [adminProfileId],
			edit: [adminProfileId],
			delete: [adminProfileId],
			publicread: false,
			img: `${publicURI}/static/integrationsart/discord.jpg`,
		});
	}
	if (P && Settings.app && !Settings.app.active) {
		await Modules._models.permissions.deleteOne({
			name: "(M) Discord",
			_managed: "Discord",
		});
	}
};
