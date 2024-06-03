module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    const id = msg?._token ? modules.jwt.verify(msg._token) : undefined;
    let user = {};
    if (id) {
      user = await modules._models.user
        .findOne({ _id: id.data._ })
        .then((U: any) => {
          const _: any = {};
          if (U?._doc)
            Object.keys(U._doc).map((k: string) => {
              if (k === "_id" || k.charAt(0) !== "_") _[k] = U[k];
            });
          return _;
        });
    }
    return io.to(socket.id).emit(`identifyself`, {
      ...user,
      index: "user",
    });
  };
