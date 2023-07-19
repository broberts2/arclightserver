const discord_user_afterupdate = require("../../../ctxscripts/after-update/discord-user");

module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
	const writescript = (obj: Object, ctx: string, n: string) =>
		Object.keys(discord_user_afterupdate).map((k: string) =>
			modules.fs.writeFileSync(
				`${modules.rootDirectory}/scripts/after-update/${n}${
					k === "metadata" ? ".json" : ".js"
				}`,
				discord_user_afterupdate[k],
				{
					encoding: "utf8",
				}
			)
		);
	const deletescript = (ctx: string, n: string) =>
		["json", "js"].map((s: string) =>
			modules.fs.unlinkSync(
				`${modules.rootDirectory}/scripts/after-update/${n}.${s}`
			)
		);
	if (
		Settings.active &&
		Settings.settings.autosync_users &&
		Settings.settings.autosync_profiles
	) {
		writescript(discord_user_afterupdate, "after-update", "Discord-user");
	} else {
		try {
			deletescript("after-update", "Discord-user");
		} catch (e) {}
	}
};
