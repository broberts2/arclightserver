export default (fs: any) => {
	["media", "scripts"].map((s: string) =>
		!fs.existsSync(`${__dirname}/../../${s}`) ? fs.mkdirSync(`${s}`) : null
	);
};
