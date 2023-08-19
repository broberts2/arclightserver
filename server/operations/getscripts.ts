module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    try {
      let totalcount = 0;
      if (transforms.restrictions(io, socket, msg)) return;
      Object.keys(modules.Scripts).map((k: string) =>
        Object.keys(modules.Scripts[k]).map(() => totalcount++)
      );
      io.to(socket.id).emit(name, { records: modules.Scripts, totalcount });
    } catch (e: any) {
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: e.message,
      });
    }
  };
