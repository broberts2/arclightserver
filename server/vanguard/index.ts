module.exports =
	(modules: any, io: any, socket: any) =>
	async (token: string, cb: Function, name: string) => {
		try {
			const r = await modules._models.permissions.findOne({ name });
			const _ = modules.jwt.verify(token);
			if (_) {
				const __ = ["public", "owner"].map(
					(s: string) =>
						r &&
						!r[`${s}read`] &&
						!r[`${s}edit`] &&
						!r[`${s}create`] &&
						!r[`${s}delete`]
				);
				if (!r || (__[0] && __[1])) {
					if (_.code !== 200)
						return io.to(socket.id).emit(`serverwarning`, {
							code: _.code,
							msg: _.error,
						});
				} else return cb(_.data && _.data._ ? _.data._ : null);
			}
			const u = await modules._models.user.findOne({ _id: _.data._ });
			if (!u)
				return io.to(socket.id).emit(`servererror`, {
					code: 500,
					msg: `Unable to find user.`,
				});
			return cb(u._id);
		} catch (e: any) {
			io.to(socket.id).emit(`servererror`, {
				code: 500,
				msg: e.message,
			});
		}
	};
