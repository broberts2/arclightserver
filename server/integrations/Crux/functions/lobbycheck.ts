module.exports = (modules: any, publicURI: string) => async (msg: any) => {
  if (modules.Integrations.Crux.Settings.active) {
    let obj;
    try {
      obj = JSON.parse(atob(msg.d));
    } catch (e) {
      return { error: `Invalid url.`, code: 400 };
    }
    const Draft = await modules._models.cruxdraft.findOne({ _id: obj.id });
    if (!Draft) return { error: `Draft doesn't exist.`, code: 401 };
    return {
      success: "true",
    };
  }
};
