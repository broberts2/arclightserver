const __readformsdir =
  (modules: any, records: { [key: string]: any } = {}) =>
  (directory: string, search?: { [key: string]: any }) => {
    let totalcount = 0;
    let __template: string;
    const reFn = (directory: string, rs: { [key: string]: any }) => {
      if (modules.fs.lstatSync(directory).isDirectory()) {
        modules.fs.readdirSync(directory).map((k: string) => {
          const _ = k.split(".")[0];
          rs[_] = {};
          if (modules.fs.lstatSync(`${directory}/${k}`).isDirectory())
            __template = k;
          if (!modules.fs.lstatSync(`${directory}/${k}`).isDirectory()) {
            const _record = {
              ...JSON.parse(
                modules.fs.readFileSync(`${directory}/${k}`, {
                  encoding: "utf8",
                })
              ),
              __filename: k,
              __template,
            };
            if (!search || _record.title === search.title) {
              totalcount++;
              rs[_] = _record;
            }
          } else {
            reFn(`${directory}/${k}`, rs[_]);
          }
        });
      }
    };
    reFn(directory, records);
    return { records, totalcount };
  };

module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    try {
      const limit = msg.search ? msg.search.limit : null;
      const sort = msg.search ? msg.search.sort : null;
      const skip = msg.search ? msg.search.skip : 0;
      const index = msg.index;
      if (msg.search) {
        delete msg.search.limit;
        delete msg.search.skip;
        delete msg.search.sort;
      }
      const records: { [key: string]: any } | Array<{ [key: string]: any }> =
        __readformsdir(modules)(
          `${modules.rootDirectory}/forms/documents${
            msg && msg.search && msg.search.template
              ? `/${msg.search.template.split(".")[0]}`
              : ""
          }`,
          msg && msg.search ? msg.search : null
        );
      return io.to(socket.id).emit(`getforms`, {
        index,
        records: records.records,
        totalcount: records.totalcount,
      });
    } catch (msg) {
      console.log(msg);
      return io.to(socket.id).emit(`servererror`, {
        code: 503,
        msg,
      });
    }
  };
