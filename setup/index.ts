export default async (
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
	if (mongoose.connection.readyState < 1)
		mongoose
			.connect(`mongodb://127.0.0.1/${config.database}`, {
				keepAlive: true,
			})
			.then(null, (err: any) => new Error(err));
	require("./setupStaticDirectories").default(fs);
	const modules: {
		[key: string]: { [key: string]: any };
	} = {};
	const models: {
		[key: string]: { [key: string]: any };
	} = {};
	models["model"] = mongoose.model("model", new Schema({}, { strict: false }));
	await require("./setupPermissionsModel").default(models, BaseModelMod);
	const profile = await models.model.findOne({
		_type: "profile",
	});
	if (!profile)
		await models.model.create(
			Object.assign(
				{
					_type: "profile",
					_system: true,
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
					metaimg: `http://localhost:7000/static/defaultart/profile.jpg`,
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
					metaimg: `http://localhost:7000/static/defaultart/user.jpg`,
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
					text: "Settings",
					icon: "gears",
					subicon: "gear",
					metaimg: `http://localhost:7000/static/defaultart/settings.jpg`,
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
					recordtype: {
						_type: "String",
						type: String,
						unique: true,
						required: true,
					},
					accessurl: {
						_type: "String",
						type: String,
						unique: true,
						required: true,
					},
					accesstype: {
						_type: "String",
						type: String,
						unique: false,
						required: true,
					},
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
					metaimg: `http://localhost:7000/static/defaultart/endpoint.jpg`,
				},
				BaseModelMod
			)
		);
	const _buildModels = __buildModels(models);
	await _buildModels();
	let adminProfile = await models.profile.findOne({ name: "administrator" });
	if (!adminProfile)
		adminProfile = await models.profile.create({
			name: "administrator",
			hierarchy: 0,
			img: `http://localhost:7000/static/defaultart/profile.jpg`,
		});
	const serverSettings = await models.settings.findOne({});
	if (!serverSettings)
		models.settings.create({
			name: "default",
			img: `http://localhost:7000/static/defaultart/settings.jpg`,
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
			img: `http://localhost:7000/static/defaultart/user.jpg`,
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
						publicread: false,
						img: `http://localhost:7000/static/defaultart/permissions.jpg`,
					})
			)
	);
	modules.Integrations = {};
	modules.Scripts = collectScripts();
	modules.runScripts = runScripts(modules);
	modules.buildIntegrations = buildIntegrations(modules);
	modules.recursiveLookup = recursiveLookup(modules);
	const r = runRoutes(modules);
	["get", "post", "put", "delete"].map((s: string) =>
		app[s]("/api/:endpoint", (req: any, res: any) => r(req, res))
	);
	SocketIO(
		server,
		config.port,
		Object.assign(modules, {
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
