module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
	const loadStations: any = async (
		url: string,
		collection: Array<{ [key: string]: any }> = [],
		Tracked: { [key: string]: boolean } = {}
	) => {
		const _stations = await modules.fetch(url).then((res: any) => {
			try {
				return JSON.parse(res);
			} catch (e) {
				return;
			}
		});
		if (!_stations) return "Rate limit exceeded.";
		const newStations = await Promise.all(
			_stations.features.filter(async (station: any) => {
				if (Tracked[station.properties.stationIdentifier]) return;
				Tracked[station.properties.stationIdentifier] = true;
				const observation = await modules
					.fetch(
						`https://api.weather.gov/stations/${station.properties.stationIdentifier}/observations/latest`
					)
					.then((res: any) => {
						try {
							return JSON.parse(res);
						} catch (e) {
							return;
						}
					});
				if (!observation || observation.detail === "Not Found") return;
				return station;
			})
		);
		if (_stations.pagination && _stations.pagination.next && newStations.length)
			return await loadStations(
				_stations.pagination.next,
				collection.concat(newStations),
				Tracked
			);
		else return collection;
	};
	const stations: Array<{ [key: string]: any }> = await loadStations(
		`https://api.weather.gov/stations`
	);
	if (stations && Array.isArray(stations)) {
		const KnownStations: { [key: string]: any } = {};
		const AllStations = await modules._models.weatherstation.find();
		if (Array.isArray(AllStations))
			AllStations.map((station: { [key: string]: any }) => {
				KnownStations[station.stationid] = station;
			});
		await Promise.all(
			stations.map(async (station: { [key: string]: any }) => {
				if (!KnownStations[station.properties.stationIdentifier]) {
					await modules._models.weatherstation.insertMany({
						stationid: station.properties.stationIdentifier,
						type: station.type,
						geometry: JSON.stringify(station.geometry),
						properties: JSON.stringify(station.properties),
					});
				}
			})
		);
	}
	console.log("done");
};
