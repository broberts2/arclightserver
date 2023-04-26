module.exports = (rootDirectory: string, fs: any) => {
	["media", "scripts"].map((s: string) =>
		!fs.existsSync(`${rootDirectory}/${s}`)
			? fs.mkdirSync(`${rootDirectory}/${s}`)
			: null
	);
	["create", "delete", "get", "update"].map((__: string) =>
		["before", "after"].map((_: string) =>
			!fs.existsSync(`${rootDirectory}/scripts/${_}-${__}`)
				? fs.mkdirSync(`${rootDirectory}/scripts/${_}-${__}`)
				: null
		)
	);
	if (!fs.existsSync(`${rootDirectory}/scripts/universal`))
		fs.mkdirSync(`${rootDirectory}/scripts/universal`);
};
