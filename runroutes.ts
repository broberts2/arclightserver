export default (modules: any) => async (method: string, req: any, res: any) => {
	try {
		const accesstype = req.method.toLowerCase();
		const E = await modules._models.endpoint.findOne({
			accessurl: req.params.endpoint,
			accesstype,
		});
		if (!E) return res.status(404).send("Endpoint not found.");
		if (!req || !req.body) return res.status(401).send("Missing request body.");
		if (!req.body.username || !req.body.password)
			return res
				.status(403)
				.send("Missing username or password in request body.");
		const U = await modules._models.user.findOne({
			username: req.body.username,
		});
		if (!U) return res.status(401).send("User not found.");
		if (modules.Cryptr.decrypt(U._password) !== req.body.password)
			return res
				.status(403)
				.send("Invalid username or password in request body.");
		if (
			!U.profiles.some((s: string) =>
				E.profileaccess.find((ss: string) => ss === s.toString())
			)
		)
			return res.status(403).send("Forbidden.");
		if (accesstype === "get") {
			const records = await modules._models[E.recordtype].find(
				req.body.query ? req.body.query : {}
			);
			return res.json(records);
		} else if (accesstype === "post") {
			if (req.body.query && Object.keys(req.body.query)) {
				if (!req.body.records)
					return res
						.status(402)
						.send("Missing 'records' key in request body for POST.");
				const records = await modules._models[E.recordtype].insertMany(
					req.body.query,
					req.body.records
				);
				return res.json(records);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for POST.");
		} else if (accesstype === "put") {
			if (req.body.query && Object.keys(req.body.query)) {
				if (!req.body.records)
					return res
						.status(402)
						.send("Missing 'records' key in request body for PUT.");
				const records = await modules._models[E.recordtype].updateMany(
					req.body.query,
					req.body.records
				);
				return res.json(records);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for PUT.");
		} else if (accesstype === "delete") {
			if (req.body.query && Object.keys(req.body.query)) {
				const records = await modules._models[E.recordtype].deleteMany(
					req.body.query
				);
				return res.json(records);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for DELETE.");
		}
	} catch (e) {
		return res.status(500).send(e);
	}
};
