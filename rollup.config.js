const typescript = require("rollup-plugin-ts");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const nodePolyfills = require("rollup-plugin-node-polyfills");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const dts = require("rollup-plugin-dts");
const babel = require("@rollup/plugin-babel").babel;
const json = require("@rollup/plugin-json");
const packageJson = require("./package.json");
module.exports = [
	{
		input: "index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: false,
			},
		],
		plugins: [
			commonjs({
				include: "node_modules/**/*",
			}),
			nodeResolve(),
			nodePolyfills(),
			json(),
			peerDepsExternal(),
			typescript(),
		],
	},
];
