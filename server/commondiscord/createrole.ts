module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (options: object) => {
		let role;
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			role = await D.mnemonics.guild.roles.create(options);
		}
		D.mnemonics.role = role;
		return role;
	};
