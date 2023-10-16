module.exports =
  (Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
    const R = await Modules._models.endpoint.findOne({
      name: "(M) riotgames-post-stats",
      _managed: "LoL Tournament API",
    });
    if (Settings.active && !R && Settings.settings.endpoints.active) {
      let P;
      const profile = await Modules._models.profile.findOne({
        name: "(M) riotgames",
        _managed: "LoL Tournament API",
      });
      if (!profile) {
        P = await Modules._models.profile
          .insertMany({
            name: "(M) riotgameslol",
            _managed: "LoL Tournament API",
            hierarchy: 10,
            img: `https://highmountainlabs.io/arclight/cdn/media/riotgames.png`,
          })
          .then((r: any) => r[0]);
      }
      const user = await Modules._models.user.findOne({
        name: "(M) riotgameslol",
        _managed: "LoL Tournament API",
      });
      if (!user && P) {
        await Modules._models.user.insertMany({
          _system: true,
          _managed: "LoL Tournament API",
          username: "(M) riotgameslol",
          _password: Modules.Cryptr.encrypt("123456"),
          profiles: [P._id],
          img: `https://highmountainlabs.io/arclight/cdn/media/riotgames.png`,
        });
      }
      await Modules._models.endpoint.insertMany({
        _system: true,
        _managed: "LoL Tournament API",
        accesstype: "post",
        accessurl: Settings.settings.endpoints.accessurl,
        img: `https://highmountainlabs.io/arclight/cdn/media/riotgames.png`,
        name: "(M) riotgames-post-stats",
        profileaccess: [P._id],
        recordtype: "(M) lolgamestats",
        nonstrict: true,
      });
      if (fn) fn("endpoint");
    } else if (R && (!Settings.active || !Settings.settings.endpoints.active)) {
      const profile = await Modules._models.profile.findOne({
        name: "(M) riotgameslol",
      });
      if (profile)
        await Modules._models.profile.deleteOne({
          name: "(M) riotgameslol",
          _managed: "LoL Tournament API",
        });
      const user = await Modules._models.user.findOne({
        username: "(M) riotgameslol",
        _managed: "LoL Tournament API",
      });
      if (user)
        await Modules._models.user.deleteOne({
          username: "(M) riotgameslol",
          _managed: "LoL Tournament API",
        });
      await Modules._models.endpoint.deleteOne({
        name: "(M) riotgames-post-stats",
        _managed: "LoL Tournament API",
      });
      if (fn) fn("endpoint");
    }
  };
