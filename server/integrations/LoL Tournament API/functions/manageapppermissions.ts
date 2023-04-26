module.exports =
	(Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
		const P = await Modules._models.permissions.findOne({
			name: "(M) LoL Tournament API",
		});
		if (!P && Settings.app.active) {
			const adminProfileId = await Modules._models.profile
				.findOne({
					name: "administrator",
				})
				.then((p: any) => p._id);
			await Modules._models.permissions.insertMany({
				_system: true,
				_managed: "LoL Tournament API",
				_lookupmodel: undefined,
				_app: true,
				name: "(M) LoL Tournament API",
				create: [adminProfileId],
				read: [adminProfileId],
				edit: [adminProfileId],
				delete: [adminProfileId],
				publicread: false,
				img: `${publicURI}/static/media/riotxlol.jpg`,
			});
			if (fn) fn("permissions");
		}
		if (P && !Settings.app.active) {
			await Modules._models.permissions.deleteOne({
				name: "(M) LoL Tournament API",
				_managed: "LoL Tournament API",
			});
			if (fn) fn("permissions");
		}
	};
