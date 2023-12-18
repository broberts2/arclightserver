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
      const beforeCreate = await modules.runScripts(
        "before-create",
        io,
        socket
      )({ msg, records: null });
      if (beforeCreate && !beforeCreate.success)
        throw new Error(`Script Error: ${beforeCreate.error}`);
      let records;
      if (msg._model === "media") {
        const MediaRecord = await modules._models.media
          .insertMany({
            _system: true,
            _parent: undefined,
            _ext: msg.filename.split(".")[1],
            name: msg.filename.split(".")[0],
            userId: msg.userId.toString(),
          })
          .then((res: any) => res[0]);
        await modules._models.media.updateOne(
          { _id: MediaRecord._id },
          {
            url: `${modules.globals.publicURI}/static/media/${MediaRecord._id}.${MediaRecord._ext}`,
            img: `${modules.globals.publicURI}/static/media/${MediaRecord._id}.${MediaRecord._ext}`,
          }
        );
        modules.fs.writeFileSync(
          `${__dirname}/../../media/${MediaRecord._id.toString()}.${
            MediaRecord._ext
          }`,
          msg.file,
          {
            encoding: "base64",
          }
        );
      } else {
        records = await modules._models[msg._model].insertMany(
          transforms.reduce(msg)
        );
      }
      const after = records
        ? await modules._models[msg._model].find({
            _id: { $in: records.map((r: any) => r._id) },
          })
        : [];
      const afterCreate = await modules.runScripts(
        "after-create",
        io,
        socket
      )({ msg, records: { after } });
      if (afterCreate && !afterCreate.success)
        throw new Error(`Script Error: ${afterCreate.error}`);
      io.to(socket.id).emit(`${name}_${msg._model}`, {
        [msg._model]: records,
        _triggerFetch: msg._model === "media",
      });
      return io.to(socket.id).emit(`serversuccess`, {
        code: nopanel ? 210 : 201,
        msg: `Create successful.`,
      });
    } catch (msg) {
      console.log(msg);
      return io.to(socket.id).emit(`servererror`, {
        code: 503,
        msg,
      });
    }
  };
