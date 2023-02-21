export default (Modules: any) => async (Settings: any, fn?: Function) => {
	const R = await Modules._models.model.findOne({
		_type: "lolgamestats",
	});
	const P = await Modules._models.permissions.findOne({
		name: "lolgamestats",
	});
	if (Settings.active && !R) {
		let _r;
		if (!R)
			_r = await Modules._models.model.insertMany({
				_system: true,
				_type: "lolgamestats",
				text: "LoL Game Stats",
				icon: "phoenix-framework",
				metaimg: `http://localhost:7000/static/media/riotxlol.jpg`,
			});
		if (!P) {
			const adminProfileId = await Modules._models.profile
				.findOne({
					name: "administrator",
				})
				.then((p: any) => p._id);
			await Modules._models.permissions.insertMany({
				_system: true,
				_lookupmodel: R ? R._id : _r ? _r._id : undefined,
				name: "lolgamestats",
				create: [adminProfileId],
				read: [adminProfileId],
				edit: [adminProfileId],
				delete: [adminProfileId],
				publicread: false,
				img: `http://localhost:7000/static/media/riotxlol.jpg`,
			});
		}
		if (fn) fn("lolgamestats");
		if (fn) fn("permissions");
	} else if (!Settings.active) {
		if (R) {
			await Modules._models.model.deleteOne({ _type: "lolgamestats" });
			if (fn) fn("lolgamestats");
		}
		if (P) {
			await Modules._models.permissions.deleteOne({ name: "lolgamestats" });
			if (fn) fn("permissions");
		}
	}
};
