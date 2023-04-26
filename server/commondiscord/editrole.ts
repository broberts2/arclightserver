module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id: string, options: object) => {
		let role;
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			if (parseInt(id)) {
				role = await D.mnemonics.guild.roles.fetch(id);
				if (!role) return;
			} else if (!parseInt(id)) {
				const r = await D.mnemonics.guild.roles.fetch();
				role = r.find((rr: { [key: string]: any }) => rr.name === id);
				if (!role) return;
			} else {
				return;
			}
			await role.edit(options);
			D.mnemonics.role = role;
		}
		return role;
	};
