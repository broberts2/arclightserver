module.exports = (
  modules: {
    [key: string]: any;
  },
  publicURI: string
) => {
  const _: { [key: string]: any } = {
    setup: async (Settings: any) => {
      await modules.Integrations.Ollama.manageappmodels(Settings);
    },
    onUpdate: async (Settings: any) => {},
    onDeactivate: async (Settings: any) => {
      await modules.Integrations.Ollama.manageappmodels(Settings);
    },
    invokables: [
      {
        permissions: ["publicread"],
        name: "ollama_ask",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const res = await modules.Integrations.Ollama.ask({
            Settings: modules.Integrations.Ollama.Settings,
            msg,
          });
          return io.to(socket.id).emit(`ollama_ask`, res);
        },
      },
    ],
  };
  return _;
};
