module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (e: string, cb: Function) =>
		await D.on(e, cb);
