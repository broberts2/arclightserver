module.exports = (modules: any, publicURI: string) => async (Settings: any) => {
  if (Settings.active) {
    const Drafts = await modules._models.cruxdraft.find({
      $and: [{ stage: { $ne: "complete" } }, { stage: { $exists: true } }],
    });
    Drafts.map((D: any) =>
      modules.Integrations.Crux.kickOff(D._id.toString(), modules.io)
    );
  }
};
