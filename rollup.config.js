const typescript = require("rollup-plugin-ts");
const folderInput = require("rollup-plugin-folder-input").folderInput;
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const json = require("@rollup/plugin-json");
const copy = require("rollup-plugin-copy");
const babel = require("@rollup/plugin-babel").babel;
const packageJson = require("./package.json");
const fs = require("fs");
const IntegrationsJSON = [];
fs.readdirSync(`${__dirname}/server/integrations`).map((e) => {
	IntegrationsJSON.push({
		src: `server/integrations/${e}/config.json`,
		dest: `dist/server/integrations/${e}`,
	});
});
module.exports = [
	{
		input: ["server/**/*.ts"],
		output: [
			{
				dir: "dist",
				format: "cjs",
				preserveModules: true,
				sourcemap: false,
				exports: "named",
			},
			// {
			// 	file: packageJson.module,
			// 	format: "esm",
			// 	sourcemap: false,
			// },
		],
		plugins: [
			json(),
			folderInput(),
			nodeResolve(),
			peerDepsExternal(),
			commonjs({
				transformMixedEsModules: true,
				strictRequires: "auto",
			}),
			// nodePolyfills(),
			typescript(),
			babel({ babelHelpers: "bundled" }),
			copy({
				targets: ["defaultart", "integrationsart"]
					.map((n) => ({
						src: `server/${n}`,
						dest: `dist/server`,
					}))
					.concat(IntegrationsJSON),
			}),
		],
	},
	// {
	// 	input: "dist/esm/types/index.d.ts",
	// 	output: [{ file: "dist/index.d.ts", format: "esm" }],
	// 	plugins: [dts.default(), nodePolyfills()],
	// },
];
