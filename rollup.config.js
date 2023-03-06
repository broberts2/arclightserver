const typescript = require("@rollup/plugin-typescript");
const packageJson = require("./package.json");
module.exports = [
	{
		input: "index.ts",
		output: {
			file: packageJson.main,
			format: "cjs",
		},
		plugins: [typescript()],
	},
];
