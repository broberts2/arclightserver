const _DiscordAPI: { [key: string]: any } = {};
require("fs")
	.readdirSync(__dirname)
	.forEach((file: any) =>
		!file.includes("index") && file.charAt(0) !== "_"
			? (_DiscordAPI[file.split(".")[0]] = require(`./${file}`))
			: null
	);
module.exports = (D: { [key: string]: any }) => {
	D.mnemonics = {};
	Object.keys(_DiscordAPI).map(
		(k: string) => (_DiscordAPI[k] = _DiscordAPI[k](D)(_DiscordAPI))
	);
	return _DiscordAPI;
};
