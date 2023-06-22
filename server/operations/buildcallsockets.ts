module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(
		io: { [key: string]: any },
		socket: { [key: string]: any },
		operations: { [key: string]: any },
		calls: { [key: string]: any },
		token?: string
	) => {
		const v = modules.vanguard(modules, io, socket);
		Object.keys(calls).map((k) => {
			const isAppFn =
				modules &&
				modules.Integrations &&
				Object.keys(modules.Integrations).find((l: string) =>
					modules.Integrations[l].invokables
						? modules.Integrations[l].invokables.find((Invokable: any) => {
								if (!(Invokable && Invokable.name && Invokable.name === k))
									return null;
								return Invokable;
						  })
						: false
				);
			return Array.isArray(calls[k])
				? calls[k].map((type: string) => {
						socket.on(`${k}_${type}`, (msg: { [key: string]: any }) =>
							v(
								token ? token : msg?._token,
								() =>
									isAppFn
										? modules.Integrations[isAppFn].invokables
												.find((Invokable: any) => Invokable.name === k)
												.fn(msg, io, socket)
										: operations[k](io, socket)({ ...msg, _model: type }),
								type
							)
						);
				  })
				: socket.on(k, (msg: { [key: string]: any }) => {
						if (k === "registeruser") return operations[k](io, socket)(msg);
						v(
							token ? token : msg?._token,
							() =>
								isAppFn
									? modules.Integrations[isAppFn].invokables
											.find((Invokable: any) => Invokable.name === k)
											.fn(msg, io, socket)
									: operations[k](io, socket)(msg),
							"model"
						);
				  });
		});
		return calls;
	};
