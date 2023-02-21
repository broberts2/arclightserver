export default (Modules: any) => async (Settings: any, fn?: Function) => {
	const R = await Modules._models.endpoint.findOne({
		name: "riotgames-post-stats",
	});
	if (Settings.active && !R && Settings.settings.endpoints.active) {
		await Modules._models.endpoint.insertMany({
			_system: true,
			accesstype: "post",
			accessurl: Settings.settings.endpoints.accessurl,
			img: "http://localhost:7000/static/defaultart/riotgames.png",
			name: "riotgames-post-stats",
			profileaccess: [],
			recordtype: "lolgamestats",
		});
		if (fn) fn("endpoint");
	} else if (R && (!Settings.active || !Settings.settings.endpoints.active)) {
		await Modules._models.endpoint.deleteOne({ name: "riotgames-post-stats" });
		if (fn) fn("endpoint");
	}
};
