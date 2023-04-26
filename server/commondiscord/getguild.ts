module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id?: string) => {
		let guild;
		if (!id || (id && parseInt(id))) {
			guild = await D.guilds.fetch(id);
		} else if (id && !parseInt(id)) {
			const g = await D.guilds.fetch();
			guild = g.find((gg: { [key: string]: any }) => gg.name === id);
			if (!guild) return;
			guild = await D.guilds.fetch(guild.id);
		}
		D.mnemonics.guild = guild;
		return guild;
	};
