const transforms = require("./transforms");
const _fs = require("fs");

module.exports = (
  server: any,
  port: number,
  modules: { [key: string]: any }
) => {
  const io = require("socket.io")(server, {
    maxHttpBufferSize: 1e9,
    cors: {
      origin: "*",
    },
  });
  const operations: {
    [key: string]: Function;
  } = {};
  _fs
    .readdirSync(`${__dirname}/operations`)
    .map(
      (e: string) =>
        (operations[e.split(".")[0]] = require(`${__dirname}/operations/${e}`)(
          modules,
          e.split(".")[0],
          transforms(modules._buildModels)
        ))
    );
  _fs
    .readdirSync(`${__dirname}/events`)
    .map((e: string) => require(`${__dirname}/events/${e}`)(io, operations));
  modules.buildIntegrations();
  modules.io = io;
  server.listen(port, () => {
    console.log(
      `⚡️ Arclight Server is running at http://localhost:${port}  ⚡️`
    );
  });
  return server;
};
