module.exports =
  (Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
    if (Settings.app.active) {
      const adminProfileId = await Modules._models.profile
        .findOne({
          name: "administrator",
        })
        .then((p: any) => p._id);
      const P = await Modules._models.permissions.findOne({
        name: "(M) LoL Tournament API",
      });
      const P2 = await Modules._models.permissions.findOne({
        name: "(M) summoner",
      });
      if (!P)
        await Modules._models.permissions.insertMany({
          _system: true,
          _managed: "LoL Tournament API",
          _lookupmodel: undefined,
          _app: true,
          name: "(M) LoL Tournament API",
          create: [adminProfileId],
          read: [adminProfileId],
          edit: [adminProfileId],
          delete: [adminProfileId],
          publicread: false,
          img: `https://highmountainlabs.io/cdn/arclight/media/riotxlol.jpg`,
        });
      if (!P2) {
        const M = await Modules._models.model.findOne({
          _type: "(M) summoner",
          _managed: "LoL Tournament API",
        });
        await Modules._models.permissions.insertMany({
          _managed: "LoL Tournament API",
          _lookupmodel: M ? M._id : null,
          recursiveinit: false,
          name: "(M) summoner",
          create: [adminProfileId],
          read: [adminProfileId],
          edit: [adminProfileId],
          delete: [adminProfileId],
          publicread: false,
          img: `https://highmountainlabs.io/cdn/arclight/media/riotxlol.jpg`,
        });
      }
      if (fn && (!P || !P2)) fn("permissions");
    }
    if (!Settings.app.active) {
      const P = await Modules._models.permissions.findOne({
        name: "(M) LoL Tournament API",
      });
      const P2 = await Modules._models.permissions.findOne({
        name: "(M) summoner",
      });
      if (P)
        await Modules._models.permissions.deleteOne({
          name: "(M) LoL Tournament API",
          _managed: "LoL Tournament API",
        });
      if (P2)
        await Modules._models.permissions.deleteOne({
          name: "(M) summoner",
          _managed: "LoL Tournament API",
        });
      if (fn && (P || P2)) fn("permissions");
    }
  };
