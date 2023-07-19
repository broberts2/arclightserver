module.exports =
	(modules: { [key: string]: any }) =>
	async (Settings: any, msg: { [key: string]: any }, io: any, socket: any) => {
		const _ = Settings.settings.redirect_uri.split("://");
		const domain = msg.domain ? `${msg.domain}.` : "";
		const redirect = msg.redirect ? `/${msg.redirect}` : "";
		return io.to(socket.id).emit(`DiscordOATH2`, {
			url: `${`https://discord.com/oauth2/authorize?client_id=${Settings.apivalues.client_id}&redirect_uri=${_[0]}://${domain}${_[1]}${redirect}&response_type=code&scope=identify%20guilds`}`,
		});
	};
