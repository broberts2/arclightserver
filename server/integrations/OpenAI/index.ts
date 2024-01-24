const OpenAI = require("openai");
const OpenAIAPI = require("../../commonopenai")(OpenAI);

module.exports = (
  modules: {
    [key: string]: any;
  },
  publicURI: string
) => {
  const _: { [key: string]: any } = {
    setup: async (Settings: any) => {
      await modules.Integrations.OpenAI.authenticate(Settings);
      // await modules.Integrations.OpenAI.buildtts(Settings);
    },
    onUpdate: async (Settings: any) => {},
    onDeactivate: async (Settings: any) => {},
  };
  _.API = OpenAIAPI;
  return _;
};
