import express, { Express } from "express";
import fs from "fs";
import path from "path";
import config from "./config";
import SocketIO from "./socket.io";
import Secrets from "./secrets";
import mongoose from "mongoose";
import vanguard from "./vanguard";
import setup from "./setup";

// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import Cryptr from "cryptr";

const Schema = mongoose.Schema;

const app: Express = express();
["integrationsart", "media", "defaultart"].map((s: string) =>
	app.use(`/static/${s}`, express.static(path.join(__dirname, `${s}`)))
);
app.use(require("cors")());
const server = require("http").createServer(app);

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

const buildIntegrations = (modules: any) => (n?: string) => {
	if (!fs.existsSync(`${__dirname}/integrations.json`)) {
		const IntegrationsJSON: { [key: string]: any } = {};
		fs.readdirSync(`${__dirname}/integrations`).map((e: string) => {
			IntegrationsJSON[e] = JSON.parse(
				fs.readFileSync(`${__dirname}/integrations/${e}/config.json`, {
					encoding: "utf8",
				})
			);
		});
		fs.writeFileSync(
			`${__dirname}/integrations.json`,
			JSON.stringify(IntegrationsJSON),
			{
				encoding: "utf8",
			}
		);
	}
	const settings = require(`${__dirname}/integrations.json`);
	Object.keys(settings).map((k: string) => {
		modules.Integrations[k] = require(`${__dirname}/integrations/${k}`).default(
			modules,
			settings[k]
		);
		if (settings[k].active && modules.Integrations[k].setup)
			modules.Integrations[k].setup();
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
	if (!modules.fs) modules.fs = fs;
	return modules;
};

const collectScripts = () => {
	const Scripts: { [key: string]: any } = {};
	fs.readdirSync(`${__dirname}/scripts`).map((e: string) => {
		const filenames = e.split(".");
		if (filenames[1] === "js") {
			const json = JSON.parse(
				fs.readFileSync(`${__dirname}/scripts/${filenames[0]}.json`, {
					encoding: "utf8",
				})
			);
			const js = fs.readFileSync(`${__dirname}/scripts/${e}`, {
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

const runScripts = (modules: any) => (ctx: string) => {
	if (modules.Scripts[ctx]) {
		const t = Object.keys(modules.Scripts[ctx])
			.filter(
				(script: string) =>
					JSON.parse(modules.Scripts[ctx][script].metadata).active
			)
			.map((script: string) => eval(modules.Scripts[ctx][script].fn)(modules));
	}
};

setup(
	config,
	mongoose,
	Schema,
	BaseModelMod,
	__buildModels,
	fs,
	Secrets,
	server,
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
	runScripts
);
