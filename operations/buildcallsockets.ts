export default (
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
		Object.keys(calls).map((k) =>
			Array.isArray(calls[k])
				? calls[k].map((type: string) =>
						socket.on(`${k}_${type}`, (msg: { [key: string]: any }) =>
							v(
								token ? token : msg?._token,
								() => operations[k](io, socket)({ ...msg, _model: type }),
								type
							)
						)
				  )
				: socket.on(k, (msg: { [key: string]: any }) =>
						v(
							token ? token : msg?._token,
							() => operations[k](io, socket)(msg),
							"model"
						)
				  )
		);
		return calls;
	};
