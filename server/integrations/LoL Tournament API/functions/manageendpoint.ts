module.exports =
	(Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
		const R = await Modules._models.endpoint.findOne({
			name: "riotgames-post-stats",
		});
		if (Settings.active && !R && Settings.settings.endpoints.active) {
			let P;
			const profile = await Modules._models.profile.findOne({
				name: "riotgames",
			});
			if (!profile) {
				P = await Modules._models.profile
					.insertMany({
						name: "riotgameslol",
						hierarchy: 10,
						img: `${publicURI}/static/defaultart/riotgames.png`,
					})
					.then((r: any) => r[0]);
			}
			const user = await Modules._models.user.findOne({
				name: "riotgameslol",
			});
			if (!user && P) {
				await Modules._models.user.insertMany({
					_system: true,
					username: "riotgameslol",
					_password: Modules.Cryptr.encrypt("123456"),
					profiles: [P._id],
					img: `${publicURI}/static/defaultart/riotgames.png`,
				});
			}
			await Modules._models.endpoint.insertMany({
				_system: true,
				accesstype: "post",
				accessurl: Settings.settings.endpoints.accessurl,
				img: `${publicURI}/static/defaultart/riotgames.png`,
				name: "riotgames-post-stats",
				profileaccess: [P._id],
				recordtype: "lolgamestats",
				nonstrict: true,
			});
			if (fn) fn("endpoint");
		} else if (R && (!Settings.active || !Settings.settings.endpoints.active)) {
			const profile = await Modules._models.profile.findOne({
				name: "riotgameslol",
			});
			if (profile)
				await Modules._models.profile.deleteOne({ name: "riotgameslol" });
			const user = await Modules._models.user.findOne({
				username: "riotgameslol",
			});
			if (user)
				await Modules._models.user.deleteOne({ username: "riotgameslol" });
			await Modules._models.endpoint.deleteOne({
				name: "riotgames-post-stats",
			});
			if (fn) fn("endpoint");
		}
	};
