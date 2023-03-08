import express, { Express } from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import config from "./config";
import SocketIO from "./socket.io";
import Secrets from "./secrets";
import mongoose from "mongoose";
import vanguard from "./vanguard";
import setup from "./setup";
import runRoutes from "./runroutes";

// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import Cryptr from "cryptr";

const Schema = mongoose.Schema;

const BaseModelMod: { [key: string]: any } = {};

const Jwt = {
	sign: (data: { [key: string]: any }) =>
		jwt.sign(data, Secrets.jwt, { expiresIn: "1h" }),
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

const __buildModels = (models: any) => async () => {
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
			models[model._type] = mongoose.model(
				model._type,
				new Schema(_, { strict: false })
			);
		}
	});
};

const buildIntegrations = (modules: any) => () => {
	if (!fs.existsSync(`${__dirname}/../integrations.json`)) {
		const IntegrationsJSON: { [key: string]: any } = {};
		fs.readdirSync(`${__dirname}/integrations`).map((e: string) => {
			IntegrationsJSON[e] = JSON.parse(
				fs.readFileSync(`${__dirname}/integrations/${e}/config.json`, {
					encoding: "utf8",
				})
			);
		});
		fs.writeFileSync(
			`${__dirname}/../integrations.json`,
			JSON.stringify(IntegrationsJSON),
			{
				encoding: "utf8",
			}
		);
	}
	const settings = require(`${__dirname}/../integrations.json`);
	Object.keys(settings).map((k: string) => {
		modules.Integrations[k] = require(`${__dirname}/integrations/${k}`).default(
			modules,
			settings[k]
		);
		fs.readdirSync(`${__dirname}/integrations/${k}/functions`).map(
			(fn: string) => {
				modules.Integrations[k][fn.split(".")[0]] =
					require(`${__dirname}/integrations/${k}/functions/${fn}`).default(
						modules,
						settings[k]
					);
			}
		);
		return modules;
	});
	Object.keys(settings).map((k: string) => {
		if (settings[k].active && modules.Integrations[k].setup)
			modules.Integrations[k].setup(settings[k]);
	});
	if (!modules.fs) modules.fs = fs;
	return modules;
};

const collectScripts = () => {
	const Scripts: { [key: string]: any } = {};
	fs.readdirSync(`scripts`).map((e: string) => {
		const filenames = e.split(".");
		if (filenames[1] === "js") {
			const json = JSON.parse(
				fs.readFileSync(`${__dirname}/scripts/${filenames[0]}.json`, {
					encoding: "utf8",
				})
			);
			const js = fs.readFileSync(`scripts/${e}`, {
				encoding: "utf8",
			});
			if (!Scripts[json.context]) Scripts[json.context] = {};
			Scripts[json.context][e] = {};
			Scripts[json.context][e].metadata = JSON.stringify(json);
			Scripts[json.context][e].fn = js.toString();
		}
	});
	return Scripts;
};

const runScripts =
	(modules: any) => (ctx: string, io: any, socket: any) => (msg: any) => {
		if (modules.Scripts[ctx]) {
			Object.keys(modules.Scripts[ctx])
				.filter(
					(script: string) =>
						JSON.parse(modules.Scripts[ctx][script].metadata).active
				)
				.map((script: string) => {
					const _ = eval(modules.Scripts[ctx][script].fn);
					return typeof _ === "function" ? _(modules, msg) : null;
				});
		}
	};

const recursiveLookup =
	(modules: any) => async (type: string, query?: { [key: string]: any }) => {
		const Terminators: { [key: string]: boolean } = {};
		const M: any = {};
		const _ = await modules._models.model.find();
		if (_) _.map((o: any) => (M[o._type] = o));
		const runner = async (type: string, query?: { [key: string]: any }) => {
			const R = await modules._models[type].find(query ? query : {});
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
								const v = await runner(M[type][key].lookup, {
									_id: { $in: [].concat(record[key]) },
								});
								_[key] = M[type][key]._type === "String" ? v[0] : v;
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
		return await runner(type, query);
	};

export default () => {
	const app: Express = express();
	["integrationsart", "defaultart"].map((s: string) =>
		app.use(`/static/${s}`, express.static(path.join(__dirname, `${s}`)))
	);
	["media"].map((s: string) =>
		app.use(`/static/${s}`, express.static(path.join(__dirname, `../${s}`)))
	);
	app.use(require("cors")());
	app.use(express.json({ limit: "50mb" }));
	app.use(express.urlencoded({ limit: "50mb" }));
	const server = require("http").createServer(app);

	setup(
		config,
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
		fetch
	);
};
