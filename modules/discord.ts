const Active = true;

const fs = require("fs");
const { Client, IntentsBitField } = require("discord.js");
const intents = new IntentsBitField();
intents.add(
	IntentsBitField.Flags.GuildPresences,
	IntentsBitField.Flags.GuildMembers
);
const Discord = new Client({ intents });

export { Active };
export default async (
	Secrets: {
		[key: string]: any;
	},
	fns: Array<{ n: string; f: Function }>,
	Models: {
		[key: string]: any;
	}
) => {
	const _: { [key: string]: Function } = {};
	await Discord.login(Secrets.discord.token);
	fns.map(
		(obj: { n: string; f: Function }) => (_[obj.n] = obj.f(Discord, Models))
	);
	return _;
};
