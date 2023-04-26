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
			} else if (id && !parseInt(id) && D.mnemonics.guild.channels) {
				const r = await D.mnemonics.guild.channels.fetch();
				channel = r.find((rr: { [key: string]: any }) => rr.name === id);
			}
			if (!channel) return;
			channel.delete();
			D.mnemonics.channel = undefined;
		}
		return;
	};
