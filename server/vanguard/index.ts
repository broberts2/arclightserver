module.exports =
  (modules: any, io: any, socket: any) =>
  async (
    token: string,
    cb: Function,
    name: { type: string; script: string } | string
  ) => {
    try {
      const _ = token ? modules.jwt.verify(token) : undefined;
      if (typeof name === "object" && name.type === "custom-call") {
        if (
          modules?.Scripts["custom-call"] &&
          modules.Scripts["custom-call"][name.script] &&
          modules.Scripts["custom-call"][name.script].metadata
        ) {
          const Script = JSON.parse(
            modules.Scripts["custom-call"][name.script].metadata
          );
          if (Script.profiles && Script.profiles.length) {
            if (!_)
              return io.to(socket.id).emit(`servererror`, {
                code: 403,
                msg: "Forbidden",
              });
            const u = await modules._models.user.findOne({ _id: _.data._ });
            if (!u || !u.profiles || !u.profiles.length)
              return io.to(socket.id).emit(`servererror`, {
                code: 500,
                msg: `Unable to validate user profiles.`,
              });
            const profiles = await modules._models.profile.find({
              _id: { $in: u.profiles },
            });
            if (
              !profiles ||
              !profiles.length ||
              !profiles.find((P: any) =>
                Script.profiles.find((PP: string) => P.name === PP)
              )
            )
              return io.to(socket.id).emit(`servererror`, {
                code: 403,
                msg: "Forbidden",
              });
          }
          if (!Script.active) {
            return io.to(socket.id).emit(`servererror`, {
              code: 501,
              msg: `Custom call script "${name.script}" is inactive.`,
            });
          }
          return cb();
        }
      } else {
        const r = await modules._models.permissions.findOne({ name });
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
      }
    } catch (e: any) {
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: e.message,
      });
    }
  };
