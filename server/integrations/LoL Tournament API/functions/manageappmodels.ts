module.exports =
  (Modules: any, publicURI: string) => async (Settings: any, fn?: Function) => {
    if (Settings.app.active) {
      const P = await Modules._models.model.findOne({
        _type: "(M) summoner",
      });
      if (!P) {
        await Modules._models.model.insertMany({
          _system: false,
          _managed: "LoL Tournament API",
          _type: "(M) summoner",
          text: "(M) Summoner",
          metaimg: `${publicURI}/static/media/riotxlol.jpg`,
          category: "",
          icon: "",
          subicon: "",
          name: {
            _type: "String",
            lookup: null,
            unique: null,
            required: true,
          },
          img: {
            _type: "String",
            lookup: null,
            unique: null,
            required: true,
          },
          puuid: null,
          profileIconId: null,
          user: {
            _type: "String",
            lookup: Settings.settings.usermodeltype,
            unique: null,
            required: true,
          },
        });
        if (fn) fn("model");
      }
    }
    if (!Settings.app.active) {
      const P = await Modules._models.model.findOne({
        _type: "(M) summoner",
      });
      if (P) {
        await Modules._models.model.deleteOne({
          _type: "(M) summoner",
        });
        if (fn) fn("model");
      }
    }
  };
