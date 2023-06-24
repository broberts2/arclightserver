module.exports = {
	metadata: `{"name":"Discord.js","active":true,"context":"after-update","model":"user","managed":"Discord"}`,
	fn: `/**********************************************************************************

	Managed Script Generated by Highmountain Labs - Discord

**********************************************************************************/

async (ServerObject, Ctx) => await Promise.all(
	Ctx.records.after.map(async (u, i) => {
		if (!u._managedid || !u._managed === "Discord") return;
		const a = Ctx.records.after[i].profiles;
		const b = Ctx.records.before[i].profiles;
		const diff =
			a.length > b.length
				? a.filter((aa) => !b.includes(aa))
				: b.filter((bb) => !a.includes(bb));
		return await Promise.all(
			diff.map(async (_id) => {
				const p = await ServerObject._models.profile.findOne({
					_id,
					_managed: "Discord",
				});
				if (p)
					await ServerObject.Integrations.Discord.API[
						a > b ? "assignrole" : "unassignrole"
					](u._managedid, p._managedid);
			})
		);
	})
);`,
};