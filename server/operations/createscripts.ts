module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    try {
      const value = JSON.parse(msg.value);
      ["js", "json"].map((s: string, i: number) =>
        modules.fs.writeFileSync(
          `${modules.rootDirectory}/scripts/${msg.ctx}/${
            value.name.split(".")[0]
          }.${s}`,
          i
            ? JSON.stringify(value)
            : `async (ServerObject, ${
                value.context === "custom-call" ? "io, socket, " : ""
              }${value.context === "endpoint" ? "Req" : "Ctx"}) => {\n\n};`,
          {
            encoding: "utf8",
          }
        )
      );
      if (!modules.Scripts) modules.Scripts = {};
      if (!modules.Scripts[msg.ctx]) modules.Scripts[msg.ctx] = {};
      modules.Scripts[msg.ctx][value.name.split(".")[0]] = {
        metadata: JSON.stringify(value),
        fn: `async (ServerObject, ${
          value.context === "custom-call" ? "io, socket, " : ""
        }${value.context === "endpoint" ? "Req" : "Ctx"}) => {
          ${
            true
              ? `return io.to(socket.id).emit(\`${`serversuccess`}\`, {
            code: 202,
            msg: \`${`Execute successful (<messge>).`}\`,
          });`
              : ""
          }
				};
				`,
      };
      io.to(socket.id).emit(`getscripts`, { records: modules.Scripts });
      return io.to(socket.id).emit(`serversuccess`, {
        code: 202,
        msg: `Create successful.`,
      });
    } catch (e: any) {
      io.to(socket.id).emit(`servererror`, {
        code: 500,
        msg: e.message,
      });
    }
  };
