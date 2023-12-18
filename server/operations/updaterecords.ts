module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    try {
      const nopanel = msg.nopanelchange;
      delete msg.nopanelchange;
      if (transforms.restrictions(io, socket, msg)) return;
      const before = await modules._models[msg._model].find({
        _id: { $in: [msg._id] },
      });
      const beforeUpdate = await modules.runScripts(
        "before-update",
        io,
        socket
      )({ msg, records: { before } });
      if (beforeUpdate && !beforeUpdate.success)
        throw new Error(`Script Error: ${beforeUpdate.error}`);
      if (msg._model === "media" && msg.file) {
        const Record = await modules._models[msg._model].findOne({
          _id: msg._id,
        });
        if (
          modules.fs.existsSync(
            `${modules.rootDirectory}/media/${msg._id.toString()}.${
              Record._ext
            }`
          )
        )
          modules.fs.unlinkSync(
            `${modules.rootDirectory}/media/${msg._id.toString()}.${
              Record._ext
            }`
          );
        modules.fs.writeFileSync(
          `${modules.rootDirectory}/media/${msg._id.toString()}.${Record._ext}`,
          msg.file,
          {
            encoding: "base64",
          }
        );
        delete msg.file;
      }
      const records = await modules._models[msg._model][
        msg.search || !msg._id ? "updateMany" : "updateOne"
      ](
        msg.search ? msg.search : msg._id ? { _id: msg._id } : {},
        transforms.reduce(msg)
      );
      const after = await modules._models[msg._model].find({
        _id: { $in: [msg._id] },
      });
      const afterUpdate = await modules.runScripts(
        "after-update",
        io,
        socket
      )({ msg, records: { before, after } });
      if (afterUpdate && !afterUpdate.success)
        throw new Error(`Script Error: ${afterUpdate.error}`);
      io.to(socket.id).emit(`${name}_${msg._model}`, {
        [msg._model]: records,
        //_triggerFetch: true,
      });
      io.to(socket.id).emit(`serversuccess`, {
        code: nopanel ? 210 : 202,
        msg: `Update successful.`,
      });
    } catch (e: any) {
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: e.message,
      });
    }
  };
