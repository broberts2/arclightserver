module.exports =
	(Modules: any, publicURI: string) =>
	async (Settings: any, msg: { [key: string]: any }, io: any, socket: any) => {
		return io.to(socket.id).emit(`serverwarning`, {
			code: 401,
			msg: `Operation inactive.`,
		});
		const metadata = await fetch(
			`https://americas.api.riotgames.com/lol/tournament/v4/codes/${msg.code}?api_key=${Settings.apivalues.tournamentapikey}`
		).then((res) => res.json());
		// const lobbyevents = await fetch(
		// 	`https://americas.api.riotgames.com/lol/tournament/v4/lobby-events/by-code/${msg.code}?api_key=${Settings.apivalues.tournamentapikey}`
		// ).then((res) => res.json());
		const gamedata = await fetch(
			`${Settings.gamedataendpoint}/${metadata.region}1_${metadata.id}?api_key=${Settings.apivalues.tournamentapikey}`
		).then((res: any) => res.json());
		console.log(metadata);
		if (gamedata.status && gamedata.status.status_code >= 300) {
			return io.to(socket.id).emit(`serverwarning`, {
				code: gamedata.status.status_code,
				msg: gamedata.status.message,
			});
		}
		io.to(socket.id).emit(`serversuccess`, {
			code: 200,
			msg: `Import successful.`,
		});
	};
//NA1_4584806702;
//NA04bd3-82682ed3-2fda-4bdd-899b-ea9ec22f69d2
