require("dotenv").config();
const express = require("express");
const Express = express.Express;
const fs = require("fs");
const path = require("path");
const nodeFetch = require("node-fetch");
const chokidar = require("chokidar");
const config = require("./config");
const SocketIO = require("./socket.io");
const Secrets = require("./secrets");
const mongoose = require("mongoose");
const vanguard = require("./vanguard");
const setup = require("./setup");
const runRoutes = require("./runroutes");
const jwt = require("jsonwebtoken");
const Cryptr = require("cryptr");

const HMLCDN = `https://highmountainlabs.io/cdn/arclight/media`;

const Schema = mongoose.Schema;

const BaseModelMod: { [key: string]: any } = {};

const Jwt = {
  sign: (data: { [key: string]: any }) =>
    jwt.sign(data, Secrets.jwt, { expiresIn: "1d" }),
  verify: (data: { [key: string]: any }) => {
    if (!data)
      return {
        error: `No token provided for query.`,
        code: 401,
      };
    try {
      return {
        data: jwt.verify(data, Secrets.jwt),
        code: 200,
      };
    } catch (e: any) {
      return {
        error: e.toString(),
        code: 500,
      };
    }
  },
};

const Crt = (C: any) => ({
  encrypt: (s: string) => C.encrypt(s),
  decrypt: (s: string) => C.decrypt(s),
});

const __buildModels = (modules: any, models: any) => async () => {
  const allDBModels = await models.model.find({});
  allDBModels.map((model: { [key: string]: any }) => {
    const _: {
      [key: string]: any;
    } = {};
    if (!models[model._type]) {
      models[model._type] = {};
      Object.keys(Object.values(model)[2])
        .filter((k) => !k.includes("_"))
        .map((k) => (_[k] = typeof Object.values(model)[2][k]));
      const S = new Schema(_, { strict: false });
      ["find"].map((s: string) => {
        S.pre(s, (next: Function) => {
          //next(new Error("something went wrong"));
          next();
        });
        S.post(s, () => {});
      });
      models[model._type] = mongoose.model(model._type, S);
    }
  });
};

const buildIntegrations =
  (rootDirectory: string, modules: any, publicURI: string) => () => {
    if (!fs.existsSync(`${rootDirectory}/integrations.json`)) {
      const IntegrationsJSON: { [key: string]: any } = {};
      fs.readdirSync(`${__dirname}/integrations`).map((e: string) => {
        IntegrationsJSON[e] = JSON.parse(
          fs.readFileSync(`${__dirname}/integrations/${e}/config.json`, {
            encoding: "utf8",
          })
        );
      });
      fs.writeFileSync(
        `${rootDirectory}/integrations.json`,
        JSON.stringify(IntegrationsJSON),
        {
          encoding: "utf8",
        }
      );
    }
    const settings = require(`${rootDirectory}/integrations.json`);
    Object.keys(settings).map((k: string) => {
      modules.Integrations[k] = require(`${__dirname}/integrations/${k}`)(
        modules,
        publicURI
      );
      fs.readdirSync(`${__dirname}/integrations/${k}/functions`).map(
        (fn: string) => {
          modules.Integrations[k][fn.split(".")[0]] =
            require(`${__dirname}/integrations/${k}/functions/${fn}`)(
              modules,
              publicURI
            );
        }
      );
      return modules;
    });
    Object.keys(settings).map((k: string) => {
      if (settings[k].active && modules.Integrations[k].setup) {
        modules.Integrations[k].setup(settings[k]);
        modules.Integrations[k].Settings = settings[k];
      }
    });
    if (!modules.fs) modules.fs = fs;
    return modules;
  };

const collectScripts = (rootDirectory: string) => {
  const Scripts: { [key: string]: any } = {};
  fs.readdirSync(`${rootDirectory}/scripts`).map((ctx: string) => {
    if (ctx === ".DS_Store") return;
    return fs
      .readdirSync(`${rootDirectory}/scripts/${ctx}`)
      .map((e: string) => {
        const filenames = e.split(".");
        if (filenames[1] === "js") {
          const json = JSON.parse(
            fs.readFileSync(
              `${rootDirectory}/scripts/${ctx}/${filenames[0]}.json`,
              {
                encoding: "utf8",
              }
            )
          );
          const js = fs.readFileSync(`${rootDirectory}/scripts/${ctx}/${e}`, {
            encoding: "utf8",
          });
          if (!Scripts[json.context]) Scripts[json.context] = {};
          const k = e.split(".")[0];
          Scripts[json.context][k] = {};
          Scripts[json.context][k].metadata = JSON.stringify(json);
          Scripts[json.context][k].fn = js.toString();
        }
      });
  });
  return Scripts;
};

const runScripts =
  (modules: any) => (ctx: string, io: any, socket: any) => async (msg: any) => {
    if (!modules.Scripts[ctx]) return;
    const __: any = { success: true };
    await Promise.all(
      Object.keys(modules.Scripts[ctx])
        .filter((script: string) => {
          if (!modules.Scripts[ctx][script]) return;
          const _ = JSON.parse(modules.Scripts[ctx][script].metadata);
          return _.active && _.context === ctx && msg.msg._model === _.model;
        })
        .map(async (script: string) => {
          const _ = eval(modules.Scripts[ctx][script].fn);
          return typeof _ === "function"
            ? await _(modules, msg)
                .catch((error: any) => ({ error }))
                .then((res: any) => {
                  __.error = res ? res.error : undefined;
                  if (res) __.success = !res.error;
                })
            : null;
        })
    );
    return __;
  };

const recursiveLookup =
  (modules: any) =>
  async (
    type: string,
    query: { [key: string]: any },
    pagination: { [key: string]: any },
    t?: string
  ) => {
    try {
      const Terminators: { [key: string]: boolean } = {};
      const M: any = {};
      const _ = await modules._models.model.find();
      if (!_) return;
      _.map((o: any) => (M[o._type] = o));
      const runner = async (
        type: string,
        query?: { [key: string]: any },
        t?: string
      ) => {
        const T: any = {};
        const SUBT: Array<string> = [];
        if (t) {
          const val = t.match(/(?<=\{)(.*?)(?=\})/);
          if (val && val[0])
            val[0].split(",").map((s: string) => {
              const __ = s.split(".");
              T[__[0].trim()] = 1;
              if (__.length > 1) SUBT.push(__.slice(1).join("."));
            });
        }
        const R = await modules._models[type]
          .find(query ? query : {}, T)
          .skip(pagination.skip)
          .limit(pagination.limit)
          .sort(pagination.sort);
        // .collation({ locale: "en", caseLevel: false });
        return await Promise.all(
          R.map(async (record: any) => {
            const _: { [key: string]: any } = {};
            await Promise.all(
              Object.keys(record._doc).map(async (key: string) => {
                if (
                  !Terminators[type] &&
                  M[type][key] &&
                  typeof M[type][key] === "object" &&
                  M[type][key].lookup
                ) {
                  const v = await Promise.all(
                    [].concat(record[key]).map(async (_id: string) => {
                      return await runner(
                        M[type][key].lookup,
                        {
                          _id,
                        },
                        t ? `{${SUBT.join(",")}}` : undefined
                      );
                    })
                  );
                  _[key] =
                    M[type][key]._type === "String" ? v.flat()[0] : v.flat();
                  Terminators[type] = true;
                } else {
                  _[key] = record[key];
                }
              })
            );
            return _;
          })
        );
      };
      return await runner(type, query, t);
    } catch (e: any) {
      console.log(e);
      if (e.code === 40352)
        throw new Error(`Tree cannot be empty when '_tree' flag is used.`);
    }
  };

module.exports = (cfg: {
  database: string;
  rootDirectory: string;
  publicURI: string;
  port: number;
  cert?: { [key: string]: any };
}) => {
  const app: any = express();
  ["integrationsart", "defaultart"].map((s: string) =>
    app.use(`/static/${s}`, express.static(path.join(__dirname, `../${s}`)))
  );
  ["media"].map((s: string) =>
    app.use(
      `/static/${s}`,
      express.static(path.join(cfg.rootDirectory, `/${s}`))
    )
  );
  app.use(require("cors")());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: false }));
  let server;
  if (cfg.cert)
    server = require("https").createServer(
      (() => {
        const _cfg: any = {};
        Object.keys(cfg.cert).map((k: string) => {
          if (cfg.cert) _cfg[k] = fs.readFileSync(cfg.cert[k], "utf8");
        });
        return _cfg;
      })(),
      app
    );
  else server = require("http").createServer(app);
  setup(
    HMLCDN,
    cfg.rootDirectory,
    cfg.port,
    cfg.publicURI,
    Object.assign(config, { database: cfg.database }),
    mongoose,
    Schema,
    BaseModelMod,
    __buildModels,
    fs,
    Secrets,
    server,
    app,
    SocketIO,
    Jwt,
    Crt(
      new Cryptr(Secrets.cryptr, {
        pbkdf2Iterations: 10000,
        saltLength: 10,
      })
    ),
    vanguard,
    buildIntegrations,
    collectScripts,
    runScripts,
    runRoutes,
    recursiveLookup,
    nodeFetch,
    chokidar
  );
};
