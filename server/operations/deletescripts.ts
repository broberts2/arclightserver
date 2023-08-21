module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: any) => {
    let value: { [key: string]: any };
    try {
      value = JSON.parse(msg.value);
    } catch (e) {
      value = msg.value;
    }
    try {
      ["js", "json"].map((s: string) =>
        modules.fs.unlinkSync(
          `${modules.rootDirectory}/scripts/${msg.ctx}/${
            value.name.split(".")[0]
          }.${s}`
        )
      );
    } catch (e) {
      console.log(e);
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: `Delete un-successful.`,
      });
      return;
    }
    modules.Scripts[msg.ctx][value.name.split(".")[0]] = undefined;
    io.to(socket.id).emit(`getscripts`, { records: modules.Scripts });
    io.to(socket.id).emit(`serversuccess`, {
      code: 203,
      msg: `Delete successful.`,
    });
  };
