module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id?: string) => {
		let channel;
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			if (!id || (id && parseInt(id))) {
				channel = await D.mnemonics.guild.channels.fetch(id);
			} else if (id && !parseInt(id)) {
				const c = await await D.mnemonics.guild.channels.fetch();
				channel = c.find((cc: { [key: string]: any }) => cc.name === id);
			}
		}
		D.mnemonics.channel = channel;
		return channel;
	};
