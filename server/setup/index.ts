const setupStaticDirectories = require("./setupStaticDirectories");

module.exports = async (
  HMLCDN: string,
  rootDirectory: string,
  port: number,
  publicURI: string,
  config: { [key: string]: any },
  mongoose: { [key: string]: any },
  Schema: any,
  BaseModelMod: { [key: string]: any },
  __buildModels: Function,
  fs: any,
  Secrets: any,
  server: any,
  app: any,
  SocketIO: any,
  jwt: any,
  Cryptr: any,
  vanguard: any,
  buildIntegrations: any,
  collectScripts: any,
  runScripts: any,
  runRoutes: any,
  recursiveLookup: any,
  fetch: any,
  chokidar: any
) => {
  if (mongoose.connection.readyState < 1) {
    mongoose
      .connect(`mongodb://127.0.0.1/${config.database}`, {
        keepAlive: true,
      })
      .then(
        () => console.log("Arclight connected."),
        (err: any) => new Error(err)
      );
  }
  const modules: {
    [key: string]: { [key: string]: any };
  } = {};
  const models: {
    [key: string]: { [key: string]: any };
  } = {};
  models["model"] = mongoose.model("model", new Schema({}, { strict: false }));
  await Promise.all(
    fs.readdirSync(`${__dirname}/models`).map(async (file: string) => {
      return await require(`./models/${file}`)(
        models,
        BaseModelMod,
        publicURI,
        HMLCDN
      );
    })
  );
  const _buildModels = __buildModels(modules, models);
  await _buildModels();
  let adminProfile = await models.profile.findOne({ name: "administrator" });
  if (!adminProfile)
    adminProfile = await models.profile.create({
      name: "administrator",
      hierarchy: 0,
      img: `${HMLCDN}/profile.jpg`,
    });
  const serverSettings = await models.settings.findOne({});
  if (!serverSettings)
    models.settings.create({
      name: "default",
      img: `${HMLCDN}/settings.jpg`,
      userregistration: true,
    });
  const themes = await models.theme.findOne({});
  if (!themes)
    models.theme.create({
      _system: true,
      name: "default",
      img: `${HMLCDN}/1.jpg`,
      fontfamily: "Russo One",
      primarytextcolor: "rgb(255,255,255)",
      secondarytextcolor: "rgb(141, 0, 222)",
      backgroundprimarycolor: "rgb(40,44,52)",
      backgroundsecondarycolor: "rgb(32,32,32)",
      backgroundtertiarycolor: "rgb(255, 222, 145)",
      backgroundquarternarycolor: "rgb(203,213,225)",
      backgroundquinarycolor: "",
      text: "Themes",
    });
  const adminUser = await models.user.findOne({
    username: "administrator",
  });
  if (!adminUser)
    models.user.create({
      _system: true,
      username: "administrator",
      _password: Cryptr.encrypt("password"),
      profiles: [adminProfile._id],
      img: `${HMLCDN}/user.jpg`,
    });
  const pModels = await models.model.find({});
  const pPermissions = await models.permissions.find({});
  const adminProfileId = await models.profile
    .findOne({
      name: "administrator",
    })
    .then((p: any) => p._id);
  await Promise.all(
    pModels
      .concat([
        { _type: "model" },
        { _type: "logs" },
        { _type: "integrations" },
        { _type: "script" },
        { _type: "endpoint" },
        { _type: "event" },
        { _type: "form" },
        { _type: "form template" },
        { _type: "report" },
        { _type: "report template" },
      ])
      .filter(
        (model: any) =>
          !pPermissions.some((model2: any) => model2.name === model._type)
      )
      .map(
        async (model: any) =>
          await models.permissions.create({
            _lookupmodel: model._id,
            name: model._type,
            create: [adminProfileId],
            read: [adminProfileId],
            edit: [adminProfileId],
            delete: [adminProfileId],
            execute: model.name === "script" ? [adminProfileId] : undefined,
            publicread: model._type === "theme",
            recursiveinit: false,
            img: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          })
      )
  );
  modules.Integrations = {};
  modules.Scripts = collectScripts(rootDirectory);
  modules.runScripts = runScripts(modules);
  modules.buildIntegrations = buildIntegrations(
    rootDirectory,
    modules,
    publicURI
  );
  modules.recursiveLookup = recursiveLookup(modules);
  const r = runRoutes(modules);
  ["get", "post", "put", "delete"].map((s: string) =>
    app[s]("/api/:endpoint", (req: any, res: any) => r(req, res))
  );
  modules.globals = { publicURI, HMLCDN };
  await models.user.deleteMany({
    _unverified: true,
  });
  SocketIO(
    server,
    port,
    Object.assign(modules, {
      rootDirectory,
      fs,
      fetch,
      mongoose,
      Schema,
      _models: models,
      _buildModels,
      jwt,
      vanguard,
      Cryptr,
      chokidar,
    })
  );
  setupStaticDirectories(rootDirectory, fs, require("./mediaWatcher")(modules));
};
