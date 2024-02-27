module.exports = (modules: any, publicURI: string) => async (Settings: any) => {
  if (Settings.active) {
    if (!modules.Integrations.Crux.___runningdrafts)
      modules.Integrations.Crux.___runningdrafts = {};
    const championtype = "champion";
    const res = await modules
      .fetch(`${Settings.apivalues.datadragonurl}/api/versions.json`)
      .then((res: any) => res.json())
      .then((res: any) => res[0]);
    const champions = await modules
      .fetch(
        `${Settings.apivalues.datadragonurl}/cdn/${res}/data/en_US/champion.json`
      )
      .then((res: any) => res.json())
      .then((res: any) => Object.values(res.data));
    const ChampionModel = await modules._models.model.findOne({
      _type: championtype,
    });
    if (!ChampionModel) {
      await modules._models.model.insertMany({
        _system: true,
        _managed: "Crux",
        _type: championtype,
        text: "Champion",
        category: "",
        icon: "fire-flame-curved",
        subicon: "fire-flame-curved",
        metaimg: "https://highmountainlabs.io/arclight/cdn/media/champion.jpg",
        name: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        img: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        splash_art: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        chooseaudio: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        banaudio: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        key: {
          _type: "Number",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        tags: {
          _type: "Array",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
      });
    }
    const DraftModel = await modules._models.model.findOne({
      _type: "cruxdraft",
    });
    if (!DraftModel) {
      await modules._models.model.insertMany({
        _system: true,
        _managed: "Crux",
        _type: "cruxdraft",
        text: "Drafts",
        category: "",
        icon: "chess-knight",
        subicon: "chess-knight",
        metaimg: "https://highmountainlabs.io/arclight/cdn/media/champion.jpg",
        name: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        img: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        theme: {
          _type: "String",
          lookup: "cruxtheme",
          unique: null,
          required: null,
          searchable: null,
        },
        cruxorg: {
          _type: "String",
          lookup: "cruxorg",
          unique: null,
          required: null,
          searchable: null,
        },
        data: {
          _type: "JSON",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
      });
    }
    const OrgModel = await modules._models.model.findOne({
      _type: "cruxorg",
    });
    if (!OrgModel) {
      await modules._models.model.insertMany({
        _system: true,
        _managed: "Crux",
        _type: "cruxorg",
        text: "Orgs",
        category: "",
        icon: "user-astronaut",
        subicon: "user-astronaut",
        metaimg: "https://highmountainlabs.io/arclight/cdn/media/champion.jpg",
        name: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        img: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        profiles: {
          _type: "String",
          lookup: "profile",
          unique: null,
          required: true,
          searchable: null,
        },
      });
    }
    const ThemeModel = await modules._models.model.findOne({
      _type: "cruxtheme",
    });
    if (!ThemeModel) {
      await modules._models.model.insertMany({
        _system: true,
        _managed: "Crux",
        _type: "cruxtheme",
        text: "Themes",
        category: "",
        icon: "ethereum",
        subicon: "ethereum",
        metaimg: "https://highmountainlabs.io/arclight/cdn/media/champion.jpg",
        name: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        img: {
          _type: "String",
          lookup: null,
          unique: null,
          required: null,
          searchable: null,
        },
        backgroundvideo: {
          _type: "String",
          lookup: null,
          unique: null,
          required: true,
          searchable: null,
        },
      });
    }
    const P = await modules._models.permissions.findOne({
      name: championtype,
    });
    const adminProfileId = await modules._models.profile
      .findOne({
        name: "administrator",
      })
      .then((p: any) => p._id);
    if (!P) {
      const _lookupmodel = await modules._models.model
        .findOne({ _system: true, _managed: "Crux", _type: championtype })
        .then((res: any) => res._id);
      await modules._models.permissions.insertMany({
        _system: true,
        _managed: "Crux",
        _lookupmodel,
        name: championtype,
        create: [adminProfileId],
        read: [adminProfileId],
        edit: [adminProfileId],
        delete: [adminProfileId],
        publicread: true,
        img: `https://highmountainlabs.io/arclight/cdn/media/champion.jpg`,
      });
    }
    const P2 = await modules._models.permissions.findOne({
      name: "cruxdraft",
    });
    if (!P2) {
      const _lookupmodel = await modules._models.model
        .findOne({ _system: true, _managed: "Crux", _type: "cruxdraft" })
        .then((res: any) => res._id);
      await modules._models.permissions.insertMany({
        _system: true,
        _managed: "Crux",
        _lookupmodel,
        name: "cruxdraft",
        create: [adminProfileId],
        read: [adminProfileId],
        edit: [adminProfileId],
        delete: [adminProfileId],
        publicread: true,
        img: `https://highmountainlabs.io/arclight/cdn/media/crux.jpg`,
      });
    }
    const P3 = await modules._models.permissions.findOne({
      name: "cruxorg",
    });
    if (!P3) {
      const _lookupmodel = await modules._models.model
        .findOne({ _system: true, _managed: "Crux", _type: "cruxorg" })
        .then((res: any) => res._id);
      await modules._models.permissions.insertMany({
        _system: true,
        _managed: "Crux",
        _lookupmodel,
        name: "cruxorg",
        create: [adminProfileId],
        read: [adminProfileId],
        edit: [adminProfileId],
        delete: [adminProfileId],
        publicread: false,
        img: `https://highmountainlabs.io/arclight/cdn/media/champion.jpg`,
      });
    }
    await modules._buildModels();
    (() => {
      const run: any = async (Champion: any) => {
        const C = await modules._models.champion.findOne({ key: Champion.key });
        const UpdateObject = {
          key: Champion.key,
          img: `${Settings.apivalues.communitydragoncdnurl}/${res}/champion/${Champion.key}/splash-art`,
          name: Champion.name,
          splashimg: `${Settings.apivalues.communitydragoncdnurl}/${res}/champion/${Champion.key}/splash-art`,
          banaudio: `${Settings.apivalues.communitydragonrawurl}/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-ban-vo/${Champion.key}.ogg`,
          chooseaudio: `${Settings.apivalues.communitydragonrawurl}/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-choose-vo/${Champion.key}.ogg`,
          tags: Champion.tags,
        };
        if (C) {
          await modules._models.champion.updateOne(
            { key: C.key },
            UpdateObject
          );
        } else {
          await modules._models.champion.insertMany(UpdateObject);
        }
        if (champions.length) return await run(champions.shift());
      };
      run(champions.shift());
    })();
    await modules.Integrations.Crux.resumerunningdrafts(Settings);
  }
};
