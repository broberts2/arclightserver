module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    try {
      await eval(modules.Scripts[msg.script][msg.selectedscript].fn)(modules);
      io.to(socket.id).emit(`executescripts`, {});
      return io.to(socket.id).emit(`serversuccess`, {
        code: 202,
        msg: `Execute successful (${msg.script} - ${msg.selectedscript}).`,
      });
    } catch (e: any) {
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: e.message,
      });
    }
  };
