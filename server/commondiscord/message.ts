const { EmbedBuilder } = require("discord.js");

const _em = (embed: {
	color: number;
	title?: string;
	url?: string;
	author?: { name?: string; iconURL?: string; url?: string };
	description?: string;
	thumbnail?: string;
	fields?: Array<{ name: string; value: string; inline: boolean }>;
	image?: string;
	timestamp?: boolean;
	footer?: { text?: string; iconURL?: string };
}) => {
	const em = new EmbedBuilder();
	if (embed.color) em.setColor(embed.color);
	if (embed.title) em.setTitle(embed.title);
	if (embed.url) em.setURL(embed.url);
	if (embed.author)
		em.setAuthor({
			name: embed.author.name,
			iconURL: embed.author.iconURL,
			url: embed.author.url,
		});
	if (embed.description) em.setDescription(embed.description);
	if (embed.thumbnail) em.setThumbnail(embed.thumbnail);
	if (embed.fields)
		em.addFields.apply(
			//@ts-ignore
			this,
			embed.fields.map((el) => ({
				name: el.name,
				value: el.value,
				inline: el.inline,
			}))
		);
	if (embed.image) em.setImage(embed.image);
	if (embed.timestamp) em.setTimestamp();
	if (embed.footer)
		em.setFooter({
			text: embed.footer.text,
			iconURL: embed.footer.iconURL,
		});
	return em;
};

module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (
		id: string,
		msg:
			| string
			| {
					color: number;
					title?: string;
					url?: string;
					author?: { name?: string; iconURL?: string; url?: string };
					description?: string;
					thumbnail?: string;
					fields?: Array<{ name: string; value: string; inline: boolean }>;
					image?: string;
					timestamp?: boolean;
					footer?: { text?: string; iconURL?: string };
			  }
	) => {
		try {
			const user = await API.getuser(id);
			if (user)
				return D.users.send(
					user.id,
					typeof msg === "object" ? { embeds: [_em(msg)] } : msg
				);
		} catch (e) {}
		const channel = await API.getchannel(id);
		if (channel)
			return channel.send(
				typeof msg === "object" ? { embeds: [_em(msg)] } : msg
			);
		return;
	};
