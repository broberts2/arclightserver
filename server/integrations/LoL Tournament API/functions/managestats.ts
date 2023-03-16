module.exports =
	(Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
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
					metaimg: `${publicURI}/static/media/riotxlol.jpg`,
					league: {
						lookup: Settings.settings.leaguemodeltype,
						_type: "String",
						unique: false,
						required: false,
					},
					seasonNum: {
						_type: "Number",
						unique: false,
						required: false,
					},
					weekNum: {
						_type: "Number",
						unique: false,
						required: false,
					},
					gameNum: {
						_type: "Number",
						unique: false,
						required: false,
					},
					team1: {
						lookup: Settings.settings.teammodeltype,
						_type: "String",
						unique: false,
						required: false,
					},
					team2: {
						lookup: Settings.settings.teammodeltype,
						_type: "String",
						unique: false,
						required: false,
					},
					info: {
						_type: "JSON",
						unique: false,
						required: false,
					},
					providerId: {
						_type: "Number",
						unique: false,
						required: false,
					},
					tournamentId: {
						_type: "Number",
						unique: false,
						required: false,
					},
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
					img: `${publicURI}/static/media/riotxlol.jpg`,
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
