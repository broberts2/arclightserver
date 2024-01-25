module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    if (modules._models[msg._model]) {
      try {
        let index = msg.index;
        let limit = msg.search ? msg.search.limit : null;
        const recursive = msg._recursive;
        const sort = msg.search
          ? {
              ...msg.search.sort,
              [msg.search.key ? msg.search.key : "name"]: 1,
            }
          : null;
        const skip = msg.search ? msg.search.skip : 0;
        if (msg._model === "user" && msg._self && msg.userId) {
          msg.search = { _id: msg.userId };
          index = "self";
          limit = 1;
        }
        if (transforms.restrictions(io, socket, msg)) return;
        const beforeGet = await modules.runScripts(
          "before-get",
          io,
          socket
        )({ msg, records: null });
        if (beforeGet && !beforeGet.success)
          throw new Error(`Script Error: ${beforeGet.error}`);
        if (msg.search) {
          delete msg.search.limit;
          delete msg.search.skip;
          delete msg.search.sort;
        }
        delete msg._recursive;
        delete msg.index;
        delete msg._self;
        delete msg.userId;
        const totalcount = await modules._models[msg._model].count(msg?.search);
        const records = recursive
          ? await modules.recursiveLookup(msg._model, msg?.search, {
              skip,
              limit,
              sort,
            })
          : await modules._models[msg._model]
              .find(msg?.search)
              .skip(skip)
              .limit(limit)
              .sort(sort)
              .collation({ locale: "en", caseLevel: false });
        const afterGet = await modules.runScripts(
          "after-get",
          io,
          socket
        )({ msg, records });
        if (afterGet && !afterGet.success)
          throw new Error(`Script Error: ${afterGet.error}`);
        return io.to(socket.id).emit(`${name}_${msg._model}`, {
          index,
          records,
          totalcount,
        });
      } catch (msg: any) {
        return io.to(socket.id).emit(`servererror`, {
          code: 503,
          msg,
        });
      }
    }
  };
