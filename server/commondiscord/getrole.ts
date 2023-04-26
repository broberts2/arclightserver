module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id?: string) => {
		if (!id || (id && parseInt(id))) {
			const role = await D.mnemonics.guild.roles.fetch(id);
			D.mnemonics.role = role;
			return role;
		} else if (id && !parseInt(id)) {
			const r = await D.mnemonics.guild.roles.fetch();
			const role = r.find((rr: { [key: string]: any }) => rr.name === id);
			if (!role) return;
			D.mnemonics.role = role;
			return role;
		}
		return;
	};
