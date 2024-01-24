module.exports = (modules: any, publicURI: string) => async (Settings: any) => {
  if (!Settings.active) {
    const CruxPermissions = await modules._models.permissions.findOne({
      name: "cruxdraft",
      _managed: "Crux",
    });
    if (CruxPermissions) {
      await modules._models.permissions.deleteMany({
        _id: CruxPermissions._id.toString(),
      });
    }
    const ChampionPermissions = await modules._models.permissions.findOne({
      name: "champion",
      _managed: "Crux",
    });
    if (ChampionPermissions) {
      await modules._models.permissions.deleteMany({
        _id: ChampionPermissions._id.toString(),
      });
    }
    const OrgPermissions = await modules._models.permissions.findOne({
      name: "cruxorg",
      _managed: "Crux",
    });
    if (OrgPermissions) {
      await modules._models.permissions.deleteMany({
        _id: OrgPermissions._id.toString(),
      });
    }
    if (modules._models.cruxdraft) {
      const DraftModel = await modules._models.model.findOne({
        _type: "cruxdraft",
        _managed: "Crux",
      });
      if (DraftModel) {
        await modules._models.cruxdraft.remove({});
        await modules._models.model.deleteMany({
          _id: DraftModel._id.toString(),
        });
      }
    }
    if (modules._models.champion) {
      const ChampionModel = await modules._models.model.findOne({
        _type: "champion",
        _managed: "Crux",
      });
      if (ChampionModel) {
        await modules._models.champion.remove({});
        await modules._models.model.deleteMany({
          _id: ChampionModel._id.toString(),
        });
      }
    }
    if (modules._models.cruxorg) {
      const CruxOrgModel = await modules._models.model.findOne({
        _type: "cruxorg",
        _managed: "Crux",
      });
      if (CruxOrgModel) {
        await modules._models.cruxorg.remove({});
        await modules._models.model.deleteMany({
          _id: CruxOrgModel._id.toString(),
        });
      }
    }
    await modules._buildModels();
  }
};
