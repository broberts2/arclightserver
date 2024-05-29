module.exports = (
  modules: {
    [key: string]: any;
  },
  publicURI: string
) => {
  const _: { [key: string]: any } = {
    setup: async (Settings: any) => {
      await modules.Integrations.Ollama.setupdb(Settings);
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
          const message = await modules.Integrations.Ollama.ask(msg).then(
            (res: any) => res.message
          );
          // const message = await modules.Integrations.Ollama.query(msg.prompt);
          return io.to(socket.id).emit(`ollama_ask`, {
            message,
          });
        },
      },
    ],
  };
  return _;
};
