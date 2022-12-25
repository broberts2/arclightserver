import express, { Express } from "express";
import fs from "fs";
import config from "./config";
import SocketIO from "./socket.io";
import Secrets from "./secrets";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const app: Express = express();
app.use(require("cors")());
const server = require("http").createServer(app);

const BaseModelMod: { [key: string]: any } = {};

(async () => {
	if (mongoose.connection.readyState < 1) {
		mongoose
			.connect(`mongodb://127.0.0.1/${config.database}`, {
				keepAlive: true,
			})
			.then(null, (err) => new Error(err));
	}
	const modules: {
		[key: string]: { [key: string]: any };
	} = {};
	const models: {
		[key: string]: { [key: string]: any };
	} = {};
	models["model"] = mongoose.model("model", new Schema({}, { strict: false }));
	const permissions = await models.model.findOne({
		_type: "permissions",
	});
	if (!permissions)
		await models.model.create(
			Object.assign(
				{
					_type: "permissions",
					_system: true,
					text: "Permissions",
					icon: "database",
					subicon: "server",
				},
				BaseModelMod
			)
		);
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
					text: "Profiles",
					icon: "database",
					subicon: "server",
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
					profiles: {
						lookup: "profile",
						_type: "Array",
						type: Array,
						unique: false,
						required: false,
					},
					text: "Users",
					icon: "database",
					subicon: "server",
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
					text: "Settings",
					icon: "database",
					subicon: "server",
				},
				BaseModelMod
			)
		);
	const allDBModels = await models.model.find({});
	allDBModels.map((model: { [key: string]: any }) => {
		const _: {
			[key: string]: any;
		} = {};
		if (!models[model._type]) models[model._type] = {};
		Object.keys(Object.values(model)[2])
			.filter((k) => !k.includes("_"))
			.map((k) => (_[k] = typeof Object.values(model)[2][k]));
		models[model._type] = mongoose.model(
			model._type,
			new Schema(_, { strict: true })
		);
	});
	let adminProfile = await models.profile.findOne({ name: "administrator" });
	if (!adminProfile)
		adminProfile = await models.profile.create({
			name: "administrator",
			hierarchy: 0,
		});
	const serverSettings = await models.settings.findOne({});
	if (!serverSettings)
		models.settings.create({
			name: "default",
		});
	const adminUser = await models.user.findOne({
		username: "administrator",
	});
	if (!adminUser)
		models.user.create({
			_system: true,
			username: "administrator",
			profiles: [adminProfile._id],
		});
	await Promise.all(
		fs.readdirSync(`${__dirname}/modules`).map(async (n) => {
			const module = require(`${__dirname}/modules/${n}`);
			if (module.Active) {
				const fns = fs
					.readdirSync(`${__dirname}/module_functions/${n}`)
					.map((f) => ({
						n: f.split(".")[0],
						f: require(`${__dirname}/module_functions/${n}/${f}`).default,
					}));
				modules[n.split(".")[0]] = await module.default(Secrets, fns, models);
			}
		})
	);
	SocketIO(server, config.port, Object.assign(modules, { _models: models }));
})();
