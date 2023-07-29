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
      const records: Array<{ [key: string]: any }> = [];
      const limit = msg.search ? msg.search.limit : null;
      const sort = msg.search ? msg.search.sort : null;
      const skip = msg.search ? msg.search.skip : 0;
      const index = msg.index;
      if (msg.search) {
        delete msg.search.limit;
        delete msg.search.skip;
        delete msg.search.sort;
      }
      modules.fs
        .readdirSync(`${modules.rootDirectory}/forms/templates`)
        .filter((e: string) =>
          msg.search && Object.keys(msg.search).length
            ? typeof msg.search.name === "string"
              ? e
                  .split(".")[0]
                  .toLocaleLowerCase()
                  .includes(msg.search.name.toLocaleLowerCase())
              : e
                  .split(".")[0]
                  .toLocaleLowerCase()
                  .includes(msg.search.name["$regex"].toLocaleLowerCase())
            : true
        )
        .map((e: string) => {
          totalcount++;
          records.push({
            __template: e,
            ...JSON.parse(
              modules.fs.readFileSync(
                `${modules.rootDirectory}/forms/templates/${e}`,
                {
                  encoding: "utf8",
                }
              )
            ),
          });
        });
      return io.to(socket.id).emit(`getformtemplates`, {
        index,
        records,
        totalcount,
      });
    } catch (msg) {
      console.log(msg);
      return io.to(socket.id).emit(`servererror`, {
        code: 503,
        msg,
      });
    }
  };
