const c = (b: boolean, k: string, n: number) => {
	if (n === 1 && k === "getrecords") return b;
	else if (n === 2 && (k === "getrecords" || k === "updaterecords")) return b;
	else if (
		n === 3 &&
		(k === "getrecords" ||
			k === "updaterecords" ||
			k === "createrecords" ||
			k === "deleterecords")
	)
		return b;
	return false;
};

module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	async (
		io: any,
		socket: any,
		msg: { [key: string]: any },
		savetoken: Function,
		cleartoken: Function,
		noauth: Function,
		cb: Function
	) => {
		let token;
		let u: { [key: string]: any } | null = null;
		const key = (s: string, m: boolean) => {
			const _: string = m ? `datamodels` : `records`;
			switch (s) {
				case "create":
					return `create${_}`;
				case "read":
					return `get${_}`;
				case "edit":
					return `update${_}`;
				case "delete":
					return `delete${_}`;
			}
		};
		const calls: { [key: string]: any } = {};
		if (!msg._token && msg.username && msg.password) {
			u = await modules._models.user.findOne({
				username: msg.username,
			});
			if (u && modules.Cryptr.decrypt(u._password) === msg.password)
				token = savetoken(modules.jwt.sign({ _: u._id }));
			else noauth(`Invalid Username or Password.`);
		} else if (!msg._token) {
			io.to(socket.id).emit("cleartoken");
			if (!msg.username) noauth(`Username required.`);
			else if (!msg.password) noauth(`Password required.`);
		} else if (msg._token) {
			const t = modules.jwt.verify(msg._token);
			if (t.code === 200)
				u = await modules._models.user.findOne({
					_id: t.data._,
				});
		}
		if (u && u.profiles)
			u.profiles = u.profiles.map((_p: any) => _p.toString());
		const permissions = await modules._models.permissions.find();
		permissions.map((p: any) => {
			return ["create", "read", "edit", "delete"].map((s: string) =>
				p[s]
					? p[s].map((id: string) => {
							const k = key(s, p.name === "model");
							if (k) {
								if (
									p.publicread ||
									(u && u.profiles && u.profiles.includes(id.toString()))
								) {
									if (
										c(p.name === "logs", k, 1) ||
										c(p.name === "integrations", k, 2) ||
										c(p._app, k, 3) ||
										c(p.name === "script", k, 3)
									) {
										const n =
											p.name.slice(-1) === "s"
												? p.name.slice(0, p.name.length - 1)
												: p.name;
										calls[k.replace("records", `${n}s`)] = true;
										if (
											modules &&
											modules.Integrations &&
											modules.Integrations[n] &&
											modules.Integrations[n].invokables
										)
											modules.Integrations[n].invokables.map(
												(invokable: any) => {
													if (invokable.permissions.includes(s))
														calls[invokable.name] = true;
												}
											);
									} else if (
										!["integrations", "script"].find(
											(el: string) => p.name === el
										)
									) {
										if (!calls[k]) calls[k] = p.name === "model" ? true : [];
										if (p.name !== "model") {
											if (p.recursiveinit) {
												if (!calls.recursiveinit) calls.recursiveinit = [];
												if (
													!calls.recursiveinit.find((s: string) => s === p.name)
												)
													calls.recursiveinit.push(p.name);
											}
											return calls[k].push(p.name);
										}
									}
								}
							}
					  })
					: null
			);
		});
		const R = await modules._models.settings.findOne({ name: "default" });
		if (R && R.userregistration) calls.registeruser = true;
		if (msg && msg.redirect && u)
			io.to(socket.id).emit("redirect", { route: "/" });
		cb(calls, token);
	};
