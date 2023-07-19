module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (id: string, options: { [key: string]: any }) => {
		const channelintresolver = require("./_channelintresolver");
		let channel;
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function")
		) {
			if (options.type) options.type = channelintresolver(options.type);
			if (parseInt(id)) {
				channel = await D.mnemonics.guild.channels.fetch(id);
			} else if (!parseInt(id)) {
				const r = await D.mnemonics.guild.channels.fetch();
				channel = r.find((rr: { [key: string]: any }) => rr.name === id);
			}
			if (!channel) return;
			await channel.edit(options);
			D.mnemonics.channel = channel;
		}
		return channel;
	};
