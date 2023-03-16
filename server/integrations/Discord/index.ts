//const fs = require("fs");
const { Client, IntentsBitField } = require("discord.js");
const intents = new IntentsBitField();
intents
	.add
	// IntentsBitField.Flags.GuildPresences,
	// IntentsBitField.Flags.GuildMembers
	();
const Discord = new Client({ intents });

module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function } = {
		Discord,
		setup: async (Settings: any) => {
			if (Settings.token) await Discord.login(Settings.apivalues.token);
		},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {
			console.log(Settings);
		},
	};
	return _;
};
