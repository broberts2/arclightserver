export default (Modules: any) => async (record: any) => {
	const Settings = require(`integrations.json`)["LoL Tournament API"];
	const data = await fetch(
		`${Settings.gamedataendpoint}/${record.region}_${record.gameId}?api_key=${Settings.apivalues.tournamentapikey}`
	).then((res: any) => res.json());
	Object.keys(data).map((k: string) =>
		typeof data[k] === "object" ? (data[k] = JSON.stringify(data[k])) : null
	);
	const M = JSON.parse(record.metaData);
	data.name = JSON.parse(data.info).tournamentCode;
	data.providerId = record.providerId;
	data.tournamentId = record.tournamentId;
	data.img = Settings.decorators.img;
	["league", "seasonNum", "weekNum", "gameNum", "team1", "team2"].map(
		(key: string) => (data[key] = M[key])
	);
	return data;
};
