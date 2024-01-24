module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  if (Settings.apivalues.client_secret) {
    await modules.Integrations.OpenAI.API.authenticate(
      Settings.apivalues.client_secret
    );
  }
};
