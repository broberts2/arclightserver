module.exports =
  (Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
    const R = await Modules._models.model.findOne({
      _type: "(M) lolgamestats",
      _managed: "LoL Tournament API",
    });
    const P = await Modules._models.permissions.findOne({
      name: "(M) lolgamestats",
      _managed: "LoL Tournament API",
    });
    if (Settings.active && !R) {
      let _r;
      if (!R)
        _r = await Modules._models.model.insertMany({
          _system: true,
          _managed: "LoL Tournament API",
          _type: "(M) lolgamestats",
          text: "LoL Game Stats",
          icon: "phoenix-framework",
          subicon: "phoenix-framework",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/5.jpg`,
          league: {
            lookup: Settings.settings.leaguemodeltype,
            _type: "String",
            unique: false,
            required: false,
          },
          seasonNum: {
            _type: "Number",
            unique: false,
            required: false,
          },
          weekNum: {
            _type: "Number",
            unique: false,
            required: false,
          },
          gameNum: {
            _type: "Number",
            unique: false,
            required: false,
          },
          team1: {
            lookup: Settings.settings.teammodeltype,
            _type: "String",
            unique: false,
            required: false,
          },
          team2: {
            lookup: Settings.settings.teammodeltype,
            _type: "String",
            unique: false,
            required: false,
          },
          info: {
            _type: "JSON",
            unique: false,
            required: false,
          },
          providerId: {
            _type: "Number",
            unique: false,
            required: false,
          },
          tournamentId: {
            _type: "Number",
            unique: false,
            required: false,
          },
        });
      if (!P) {
        const adminProfileId = await Modules._models.profile
          .findOne({
            name: "administrator",
          })
          .then((p: any) => p._id);
        await Modules._models.permissions.insertMany({
          _system: true,
          _managed: "LoL Tournament API",
          _lookupmodel: R ? R._id : _r ? _r._id : undefined,
          name: "(M) lolgamestats",
          create: [adminProfileId],
          read: [adminProfileId],
          edit: [adminProfileId],
          delete: [adminProfileId],
          publicread: false,
          img: `https://highmountainlabs.io/cdn/arclight/media/riotxlol.jpg`,
        });
      }
      if (fn) fn("(M) lolgamestats");
      if (fn) fn("permissions");
    } else if (!Settings.active) {
      if (R) {
        await Modules._models.model.deleteOne({
          _type: "(M) lolgamestats",
          _managed: "LoL Tournament API",
        });
        if (fn) fn("(M) lolgamestats");
      }
      if (P) {
        await Modules._models.permissions.deleteOne({
          name: "(M) lolgamestats",
          _managed: "LoL Tournament API",
        });
        if (fn) fn("permissions");
      }
    }
  };
