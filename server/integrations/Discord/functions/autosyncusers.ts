module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  const createuser = async (u: { [key: string]: any }) => {
    const _U = await modules._models.user.findOne({
      _managedid: u.user.id,
      _managed: "Discord",
    });
    if (_U) return;
    return await modules._models.user.insertMany({
      _managedid: u.user.id,
      _managed: "Discord",
      _system: true,
      username: `(M) ${u.user.username}`,
      img: `https://highmountainlabs.io/arclight/cdn/media/discord.jpg`,
    });
  };
  const deleteuser = async (role: { [key: string]: any }) => {
    return await modules._models.user.deleteMany({
      _managedid: role.id,
      _managed: "Discord",
    });
  };
  const updateuserrole = async (
    _b: { [key: string]: any },
    _a: { [key: string]: any }
  ) => {
    const b = _b._roles;
    const a = _a._roles;
    const diff =
      a.length > b.length
        ? a.filter((aa: string) => !b.includes(aa))
        : b.filter((bb: string) => !a.includes(bb));
    if (!diff.length) return;
    const u = await modules._models.user.findOne({
      _managed: "Discord",
      _managedid: _a.user.id,
    });
    if (u) {
      const profiles = await modules._models.profile
        .find({ _managed: "Discord", _managedid: { $in: diff } })
        .then((res: Array<{ [key: string]: any }>) =>
          res.map((p: { [key: string]: any }) => p._id.toString())
        );
      await modules._models.user.updateOne(
        { _managed: "Discord", _managedid: _a.user.id },
        {
          profiles:
            a.length > b.length
              ? u.profiles
                ? u.profiles.concat(profiles)
                : (u.profiles = [profiles])
              : u.profiles
              ? u.profiles.filter((p: string) => !profiles.includes(p))
              : (u.profiles = []),
        }
      );
    }
  };
  if (Settings.settings.autosync_users) {
    modules.Integrations.Discord.API.addeventlistener(
      "guildMemberAdd",
      createuser
    );
    modules.Integrations.Discord.API.addeventlistener(
      "guildMemberUpdate",
      updateuserrole
    );
    if (Settings.settings.desyncusers_on_leave) {
      modules.Integrations.Discord.API.addeventlistener(
        "guildMemberRemove",
        deleteuser
      );
    } else {
      modules.Integrations.Discord.API.removeeventlistener(
        "guildMemberRemove",
        deleteuser
      );
    }
    const users = await modules._models.user.find({
      _managed: "Discord",
    });
    const discordusers = await modules.Integrations.Discord.API.getuser();
    return await Promise.all(
      discordusers.map(async (du: { [key: string]: any }) => {
        if (
          !du.user.bot &&
          !users.find(
            (u: { [key: string]: any }) =>
              u.username === `(M) ${du.user.username}`
          )
        )
          return await createuser(du);
      })
    );
  } else {
    modules.Integrations.Discord.API.removeeventlistener(
      "guildMemberAdd",
      createuser
    );
    modules.Integrations.Discord.API.removeeventlistener(
      "guildMemberRemove",
      deleteuser
    );
    modules.Integrations.Discord.API.removeeventlistener(
      "guildMemberUpdate",
      updateuserrole
    );
  }
};
