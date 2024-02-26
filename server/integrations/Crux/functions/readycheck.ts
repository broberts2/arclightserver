module.exports = (modules: any, publicURI: string) => async (msg: any) => {
  if (modules.Integrations.Crux.Settings.active) {
    const _ = JSON.parse(atob(msg.query.d));
    console.log(_);
    return {};
  }
};
