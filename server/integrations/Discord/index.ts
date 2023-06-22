const {
	Client,
	IntentsBitField,
	Intents,
	PermissionFlagsBits,
} = require("discord.js");
const intents = new IntentsBitField();
intents.add(
	IntentsBitField.Flags.Guilds,
	IntentsBitField.Flags.GuildMembers,
	IntentsBitField.Flags.GuildBans,
	IntentsBitField.Flags.GuildEmojisAndStickers,
	IntentsBitField.Flags.GuildIntegrations,
	IntentsBitField.Flags.GuildWebhooks,
	IntentsBitField.Flags.GuildInvites,
	IntentsBitField.Flags.GuildVoiceStates,
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMessages,
	IntentsBitField.Flags.GuildMessageReactions,
	IntentsBitField.Flags.GuildMessageTyping,
	IntentsBitField.Flags.DirectMessages,
	IntentsBitField.Flags.DirectMessageReactions,
	IntentsBitField.Flags.DirectMessageTyping,
	IntentsBitField.Flags.MessageContent,
	IntentsBitField.Flags.GuildScheduledEvents
);
const Discord = new Client({ intents });
const DiscordAPI = require("../../commondiscord")(Discord);

module.exports = (
	modules: {
		[key: string]: any;
	},
	publicURI: string
) => {
	const _: { [key: string]: Function } = {
		Discord,
		setup: async (Settings: any) => {
			await modules.Integrations.Discord.authenticate(Settings);
			await modules.Integrations.Discord.autosyncprofiles(Settings);
			await modules.Integrations.Discord.autosyncusers(Settings);
			await modules.Integrations.Discord.managescripts(Settings);
		},
		onUpdate: async (Settings: any) => {
			await modules.Integrations.Discord.authenticate(Settings);
			await modules.Integrations.Discord.autosyncprofiles(Settings);
			await modules.Integrations.Discord.autosyncusers(Settings);
			await modules.Integrations.Discord.managescripts(Settings);
		},
		onDeactivate: async (Settings: any) => {
			await modules.Integrations.Discord.ondeactivate(Settings);
			await modules.Integrations.Discord.managescripts(Settings);
		},
	};
	_.Discord = Discord;
	_.API = DiscordAPI;
	_.PermissionFlagsBits = PermissionFlagsBits;
	return _;
};
