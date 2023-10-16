const setupStaticDirectories = require("./setupStaticDirectories");
const setupPermissionsModel = require("./setupPermissionsModel");

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
  fetch: any
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
  setupStaticDirectories(rootDirectory, fs);
  const modules: {
    [key: string]: { [key: string]: any };
  } = {};
  const models: {
    [key: string]: { [key: string]: any };
  } = {};
  models["model"] = mongoose.model("model", new Schema({}, { strict: false }));
  await setupPermissionsModel(models, BaseModelMod, publicURI, HMLCDN);
  const profile = await models.model.findOne({
    _type: "profile",
  });
  if (!profile)
    await models.model.create(
      Object.assign(
        {
          _type: "profile",
          _system: true,
          _managed: undefined,
          _managedid: undefined,
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          hierarchy: {
            _type: "Number",
            type: Number,
            unique: false,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          text: "Profiles",
          icon: "id-badge",
          subicon: "id-card",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
  const user = await models.model.findOne({
    _type: "user",
  });
  if (!user)
    await models.model.create(
      Object.assign(
        {
          _type: "user",
          _system: true,
          username: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          _password: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          profiles: {
            lookup: "profile",
            _type: "Array",
            type: Array,
            unique: false,
            required: false,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          text: "Users",
          icon: "users",
          subicon: "user-gear",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
  const settings = await models.model.findOne({ _type: "settings" });
  if (!settings)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "settings",
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          userregistration: {
            _type: "Boolean",
            type: Boolean,
            unique: false,
            required: false,
          },
          text: "Settings",
          icon: "gears",
          subicon: "gear",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
  const theme = await models.model.findOne({ _type: "theme" });
  if (!theme)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "theme",
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          fontfamily: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          primarytextcolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          secondarytextcolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundprimarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundsecondarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundtertiarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundquarternarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundquinarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          text: "Themes",
          icon: "paintbrush",
          subicon: "paintbrush",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
  const endpoint = await models.model.findOne({ _type: "endpoint" });
  if (!endpoint)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "endpoint",
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          script: "",
          accessurl: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          accesstype: "",
          profileaccess: {
            lookup: "profile",
            _type: "Array",
            type: Array,
            unique: false,
            required: false,
          },
          apikeyaccess: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          nonstrict: {
            _type: "Boolean",
            type: Boolean,
            unique: false,
            required: false,
          },
          text: "Endpoints",
          icon: "circle-nodes",
          subicon: "circle-nodes",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
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
    })
  );
};
