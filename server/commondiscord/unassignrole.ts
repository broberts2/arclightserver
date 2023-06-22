module.exports =
	(D: { [key: string]: any }) =>
	(API: { [key: string]: any }) =>
	async (uid: string, rid: string) => {
		const guild = await D.mnemonics.guild;
		if (D.mnemonics.guild && !(typeof guild[Symbol.iterator] === "function")) {
			const role = await API.getrole(rid);
			const member = await API.getmember(uid);
			if (member.roles) return await member.roles.remove(role.id);
		}
		return;
	};
