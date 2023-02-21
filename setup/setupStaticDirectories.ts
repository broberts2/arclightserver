export default (fs: any) => {
	["media", "scripts"].map((s: string) =>
		!fs.existsSync(`${__dirname}/../${s}`)
			? fs.mkdirSync(`${__dirname}/../${s}`)
			: null
	);
};
