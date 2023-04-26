module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id?: string) => {
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			if (!id || (id && parseInt(id))) {
				const member = await D.mnemonics.guild.members.fetch(id);
				D.mnemonics.member = member;
				return member;
			} else if (id && !parseInt(id)) {
				const m = await D.mnemonics.guild.members.fetch();
				const member = m.find(
					(mm: { [key: string]: any }) => mm.user.username === id
				);
				if (!member) return;
				D.mnemonics.member = member;
				return member;
			}
		}
		return;
	};
