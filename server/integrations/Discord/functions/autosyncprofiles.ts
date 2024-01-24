module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  const buildrole = async (r: { [key: string]: any }) =>
    await modules._models.profile.insertMany({
      _managedid: r.id,
      _managed: "Discord",
      _system: true,
      name: `(M) ${r.name}`,
      hierarchy: 10,
      img: `https://highmountainlabs.io/arclight/cdn/media/discord.jpg`,
    });
  const roleCreate = async (role: { [key: string]: any }) =>
    !role.managed ? buildrole(role) : null;
  const roleDelete = async (role: { [key: string]: any }) =>
    !role.managed
      ? await modules._models.profile.deleteMany({
          _managedid: role.id,
          _managed: "Discord",
        })
      : null;
  const roleUpdate = async (
    oldRole: { [key: string]: any },
    newRole: { [key: string]: any }
  ) =>
    await modules._models.profile.updateOne(
      {
        _managedid: newRole.id,
      },
      { name: `(M) ${newRole.name}` }
    );
  if (Settings.settings.autosync_profiles) {
    const profiles = await modules._models.profile.find({
      _managed: "Discord",
    });
    const roles = await modules.Integrations.Discord.API.getrole();
    modules.Integrations.Discord.API.addeventlistener("roleCreate", roleCreate);
    modules.Integrations.Discord.API.addeventlistener("roleDelete", roleDelete);
    modules.Integrations.Discord.API.addeventlistener("roleUpdate", roleUpdate);
    return await Promise.all(
      roles.map(async (r: { [key: string]: any }) => {
        if (
          !r.managed &&
          r.name.charAt(0) !== "@" &&
          !profiles.find(
            (p: { [key: string]: any }) => p.name === `(M) ${r.name}`
          )
        )
          return await buildrole(r);
      })
    );
  } else {
    modules.Integrations.Discord.API.removeeventlistener(
      "roleCreate",
      roleCreate
    );
    modules.Integrations.Discord.API.removeeventlistener(
      "roleDelete",
      roleDelete
    );
    modules.Integrations.Discord.API.removeeventlistener(
      "roleUpdate",
      roleUpdate
    );
  }
};
