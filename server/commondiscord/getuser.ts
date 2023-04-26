module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id: string) => {
		if (id && parseInt(id)) {
			const user = await D.users.fetch(id);
			D.mnemonics.user = user;
			return user;
		} else if (
			!parseInt(id) &&
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			const u = await API.getmember(id);
			if (!u) return;
			return u;
		}
		return;
	};
