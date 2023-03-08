const typescript = require("rollup-plugin-ts");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const nodePolyfills = require("rollup-plugin-node-polyfills");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const dts = require("rollup-plugin-dts");
const babel = require("@rollup/plugin-babel").babel;
const json = require("@rollup/plugin-json");
const copy = require("rollup-plugin-copy");
const packageJson = require("./package.json");
module.exports = [
	{
		input: "server/index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: false,
			},
			// {
			// 	file: packageJson.module,
			// 	format: "esm",
			// 	sourcemap: false,
			// },
		],
		plugins: [
			copy({
				targets: [
					"operations",
					"events",
					"integrations",
					"defaultart",
					"integrationsart",
				].map((n) => ({
					src: `server/${n}`,
					dest: `dist`,
				})),
			}),
			nodeResolve(),
			peerDepsExternal(),
			commonjs({ transformMixedEsModules: true, strictRequires: true }),
			json(),
			// nodePolyfills(),
			typescript(),
			//babel({ babelHelpers: "bundled" }),
		],
	},
	// {
	// 	input: "dist/esm/types/index.d.ts",
	// 	output: [{ file: "dist/index.d.ts", format: "esm" }],
	// 	plugins: [dts.default(), nodePolyfills()],
	// },
];
