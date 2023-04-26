module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id?: string) => {
		let role;
		if (!id || (id && parseInt(id))) {
			role = await D.mnemonics.guild.roles.fetch(id);
		} else if (id && !parseInt(id)) {
			const r = await D.mnemonics.guild.roles.fetch();
			role = r.find((rr: { [key: string]: any }) => rr.name === id);
		}
		if (!role) return;
		role.delete();
		D.mnemonics.role = undefined;
		return;
	};
