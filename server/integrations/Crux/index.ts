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
    kickOff: async (_id: string, io: any, socket: any) => {
      await modules.Integrations.Crux.kickoff(_id, io, socket);
    },
    updateDraft: (_id: string, io: any, socket: any) => {
      return modules.Integrations.Crux.updatedraft(_id, io, socket);
    },
    invokables: [
      {
        permissions: ["publiccreate"],
        name: "crux_createdraft",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const fn = await modules.Integrations.Crux.createdraft(msg);
          if (fn.success) {
            io.to(socket.id).emit(`serversuccess`, {
              code: 200,
              msg: `Draft creation successful.`,
            });
            return io.to(socket.id).emit(`crux_createdraft`, fn.links);
          } else {
            io.to(socket.id).emit(`servererror`, {
              code: 500,
              msg: `Unable to build draft.`,
            });
          }
        },
      },
      {
        permissions: ["publicedit"],
        name: "crux_lobbycheck",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          const fn = await modules.Integrations.Crux.lobbycheck(msg);
          return io.to(socket.id).emit(`crux_lobbycheck`, fn);
        },
      },
      {
        permissions: ["publicedit"],
        name: "crux_readycheck",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          return await modules.Integrations.Crux.readycheck(msg, io, socket);
        },
      },
      {
        permissions: ["publicedit"],
        name: "crux_selectchampion",
        fn: async (msg: { [key: string]: any }, io: any, socket: any) => {
          return await modules.Integrations.Crux.selectchampion(
            msg,
            io,
            socket
          );
        },
      },
    ],
  };
  return _;
};
