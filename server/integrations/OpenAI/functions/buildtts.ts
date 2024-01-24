module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  await modules.Integrations.OpenAI.API.buildtts(Settings);
};
