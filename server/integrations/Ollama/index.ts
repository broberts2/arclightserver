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
        name: "ollama_chat",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const res = await modules.Integrations.Ollama.chat({
            Settings: modules.Integrations.Ollama.Settings,
            msg,
          });
          return io.to(socket.id).emit(`ollama_chat`, res);
        },
      },
      {
        permissions: ["publicread"],
        name: "ollama_generate",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const res = await modules.Integrations.Ollama.generate(
            modules.Integrations.Ollama.Settings,
            msg.prompt
          );
          return io.to(socket.id).emit(`ollama_generate`, res);
        },
      },
    ],
  };
  return _;
};
