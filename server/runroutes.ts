module.exports = (modules: any) => async (req: any, res: any) => {
	try {
		const accesstype = req.method.toLowerCase();
		const E = await modules._models.endpoint.findOne({
			accessurl: req.params.endpoint,
			accesstype,
		});
		if (!E) return res.status(404).send("Endpoint not found.");
		if (!req || !req.body) return res.status(401).send("Missing request body.");
		const metaData =
			typeof req.body.metaData === "string"
				? JSON.parse(req.body.metaData)
				: req.body.metaData;
		const apitoken =
			(req.query && req.query.apitoken) ||
			(req.body && (req.body.apitoken || metaData?.apitoken));
		delete req.query.apitoken;
		delete req.body.apitoken;
		if (metaData) {
			delete metaData.apitoken;
			req.body.metaData =
				typeof req.body.metaData === "string"
					? JSON.stringify(metaData)
					: metaData;
		}
		if (!apitoken || (apitoken && E.apikeyaccess !== apitoken)) {
			if (!req.body.username || !req.body.password)
				return res
					.status(403)
					.send(
						"Missing/invalid username, password, or API Token in request query/body."
					);
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
		}
		const preProcess = Object.keys(modules.Integrations).find(
			(k: string) => modules.Integrations[k][E.accessurl]
		);
		let query;
		if (req.query.query && typeof req.query.query === "string") {
			try {
				query = JSON.parse(req.query.query);
			} catch (e) {
				console.log(e);
			}
		} else if (req.body.query && typeof req.body.query === "object") {
			try {
				query = req.body.query;
			} catch (e) {}
		}
		if (accesstype === "get") {
			const r = query && typeof query === "object" && query._recursive;
			if (r) delete query._recursive;
			const records = r
				? await modules.recursiveLookup(
						E.recordtype,
						query && typeof query === "object" ? query : {}
				  )
				: await modules._models[E.recordtype].find(
						query && typeof query === "object" ? query : {}
				  );
			return res.json(records);
		} else if (accesstype === "post") {
			if ((req.body.query && Object.keys(req.body.query)) || E.nonstrict) {
				if (!req.body.records && !E.nonstrict)
					return res
						.status(402)
						.send("Missing 'records' key in request body for POST.");
				const _ = E.nonstrict ? req.body : req.body.records;
				const records = preProcess
					? await modules.Integrations[preProcess][E.accessurl](_)
					: _;
				const results = await modules._models[E.recordtype].insertMany(records);
				return res.json(results);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for POST.");
		} else if (accesstype === "put") {
			if ((req.body.query && Object.keys(req.body.query)) || E.nonstrict) {
				if (!req.body.records)
					return res
						.status(402)
						.send("Missing 'records' key in request body for PUT.");
				const records = await modules._models[E.recordtype].updateMany(
					E.nonstrict ? {} : req.body.query,
					E.nonstrict ? req.body : req.body.records
				);
				return res.json(records);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for PUT.");
		} else if (accesstype === "delete") {
			if ((req.body.query && Object.keys(req.body.query)) || E.nonstrict) {
				const records = await modules._models[E.recordtype].deleteMany(
					E.nonstrict ? {} : req.body.query
				);
				return res.json(records);
			} else
				return res
					.status(402)
					.send("Non-empty object query required in request body for DELETE.");
		}
	} catch (e) {
		console.log(e);
		return res.status(500).send(e);
	}
};
