export default (Modules: any) => async (Settings: any, fn?: Function) => {
	const P = await Modules._models.permissions.findOne({
		name: "LoL Tournament API",
	});
	if (!P && Settings.app.active) {
		const adminProfileId = await Modules._models.profile
			.findOne({
				name: "administrator",
			})
			.then((p: any) => p._id);
		await Modules._models.permissions.insertMany({
			_system: true,
			_lookupmodel: undefined,
			_app: true,
			name: "LoL Tournament API",
			create: [adminProfileId],
			read: [adminProfileId],
			edit: [adminProfileId],
			delete: [adminProfileId],
			publicread: false,
			img: `http://localhost:7000/static/media/riotxlol.jpg`,
		});
		if (fn) fn("permissions");
	} else if (P && !Settings.app.active) {
		await Modules._models.permissions.deleteOne({ name: "LoL Tournament API" });
		if (fn) fn("permissions");
	}
};
