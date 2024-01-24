module.exports = (
  modules: {
    [key: string]: any;
  },
  publicURI: string
) => {
  const _: { [key: string]: any } = {
    setup: async (Settings: any) => {
      await modules.Integrations.Crux.setup(Settings);
    },
    onUpdate: async (Settings: any) => {},
    onDeactivate: async (Settings: any) => {
      await modules.Integrations.Crux.deactivate(Settings);
    },
    invokables: [
      {
        permissions: ["publiccreate"],
        name: "crux_createdraft",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          return io.to(socket.id).emit(`crux_createdraft`, { success: "true" });
        },
      },
    ],
  };
  return _;
};
