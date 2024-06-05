const transforms = require("./transforms");
const _fs = require("fs");

module.exports = (app: any, port: number, modules: { [key: string]: any }) => {
  let server;
  if (modules.cert)
    server = require("https").createServer(
      (() => {
        const _cfg: any = {};
        Object.keys(modules.cert).map((k: string) => {
          if (modules.cert) _cfg[k] = fs.readFileSync(modules.cert[k], "utf8");
        });
        return _cfg;
      })(),
      app
    );
  else server = require("http").createServer(app);
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
      `⚡️ Arclight Server is running at http://localhost:${port}  ⚡️\nRoot Directory: ${modules.rootDirectory}`
    );
  });
  return server;
};
