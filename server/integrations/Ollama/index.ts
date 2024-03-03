module.exports = (
  modules: {
    [key: string]: any;
  },
  publicURI: string
) => {
  const _: { [key: string]: any } = {
    setup: async (Settings: any) => {
      const res = await modules.Integrations.Ollama.ask(
        Settings,
        "Who are you?"
      );
    },
    onUpdate: async (Settings: any) => {},
    onDeactivate: async (Settings: any) => {},
    invokables: [
      {
        permissions: ["publicread"],
        name: "ollama_ask",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const res = await modules.Integrations.Ollama.ask(
            modules.Integrations.Ollama.Settings,
            msg.prompt
          );
          return io.to(socket.id).emit(`ollama_ask`, res);
        },
      },
    ],
  };
  return _;
};
