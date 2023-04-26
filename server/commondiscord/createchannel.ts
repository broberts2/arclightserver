module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (options: { [key: string]: any }) => {
		const channelintresolver = require("./_channelintresolver");
		let channel;
		if (
			D.mnemonics.guild &&
			!(typeof D.mnemonics.guild[Symbol.iterator] === "function") &&
			D.mnemonics.guild.channels
		) {
			if (options.type) options.type = channelintresolver(options.type);
			channel = await D.mnemonics.guild.channels.create(options);
		}
		D.mnemonics.channel = channel;
		return channel;
	};
