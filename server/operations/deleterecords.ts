module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: any) => {
    try {
      const nopanel = msg.nopanelchange;
      delete msg.nopanelchange;
      if (transforms.restrictions(io, socket, msg)) return;
      const before = await modules._models[msg._model].find({
        _id: { $in: [msg._id] },
      });
      const beforeDelete = await modules.runScripts(
        "before-delete",
        io,
        socket
      )({ msg, records: { before } });
      if (beforeDelete && !beforeDelete.success)
        throw new Error(`Script Error: ${beforeDelete.error}`);
      let after;
      if (msg._model === "media") {
        const _ext = await modules._models.media
          .findOne({ _id: msg._id })
          .then((res: any) => res._ext);
        await modules._models.media.deleteOne({ _id: msg._id });
        if (
          modules.fs.existsSync(`${__dirname}/../../media/${msg._id}.${_ext}`)
        )
          modules.fs.unlinkSync(`${__dirname}/../../media/${msg._id}.${_ext}`);
      } else {
        after = await modules._models[msg._model][
          msg.search || !msg._id ? "deleteMany" : "deleteOne"
        ](msg.search ? msg.search : { _id: msg._id });
      }
      const afterDelete = await modules.runScripts(
        "after-delete",
        io,
        socket
      )({ msg, records: { before, after } });
      if (afterDelete && !afterDelete.success)
        throw new Error(`Script Error: ${afterDelete.error}`);
      io.to(socket.id).emit(`${name}_${msg._model}`, {
        [msg._model]: after,
        // _triggerFetch: msg._model === "media",
      });
      return io.to(socket.id).emit(`serversuccess`, {
        code: nopanel ? 210 : 203,
        msg: `Delete successful.`,
      });
    } catch (msg) {
      console.log(msg);
      return io.to(socket.id).emit(`servererror`, {
        code: 503,
        msg,
      });
    }
  };
