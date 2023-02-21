const fs = require("fs");
const { Client, IntentsBitField } = require("discord.js");
const intents = new IntentsBitField();
intents
	.add
	// IntentsBitField.Flags.GuildPresences,
	// IntentsBitField.Flags.GuildMembers
	();
const Discord = new Client({ intents });

export default (
	modules: {
		[key: string]: any;
	},
	settings: { [key: string]: any }
) => {
	const _: { [key: string]: Function } = {
		Discord,
		setup: async (Settings: any) => {
			if (settings.token) await Discord.login(settings.apivalues.token);
		},
		onUpdate: async (Settings: any) => {},
		onDeactivate: async (Settings: any) => {},
	};
	return _;
};
