module.exports = (rootDirectory: string, fs: any) => {
	["media", "scripts"].map((s: string) =>
		!fs.existsSync(`${rootDirectory}/${s}`)
			? fs.mkdirSync(`${rootDirectory}/${s}`)
			: null
	);
};
