module.exports =
	(
		modules: { [key: string]: any },
		name: string,
		transforms: { [key: string]: Function }
	) =>
	(io: { [key: string]: any }, socket: { [key: string]: any }) =>
	async (msg: { [key: string]: any }) => {
		try {
			if (transforms.restrictions(io, socket, msg)) return;
			const cache: any = [];
			io.to(socket.id).emit(
				name,
				JSON.stringify(modules, (key, value) => {
					if (
						[
							"Cryptr",
							"Schema",
							"fs",
							"jwt",
							"mongoose",
							"runScripts",
							"vanguard",
							"_buildModels",
						].includes(key)
					)
						return;
					if (typeof value === "object" && value !== null) {
						if (cache.includes(value)) return;
						cache.push(value);
					}
					if (typeof value === "function") return value.toString();
					return value;
				})
			);
			return io.to(socket.id).emit(`servermessage`, {
				code: 100,
				msg: `"ServerObject" logged to console.`,
			});
		} catch (msg) {
			console.log(msg);
			return io.to(socket.id).emit(`servererror`, {
				code: 503,
				msg,
			});
		}
	};
