module.exports =
  (modules: any, publicURI: string) =>
  async (_id: string, io: any, socket: any) => {
    if (modules.Integrations.Crux.Settings.active) {
      try {
        return await modules.Integrations.crux.updateDraft({});
      } catch (e) {
        return io
          .to(socket.id)
          .emit(`servererror`, { code: 500, msg: "Couldn't start draft." });
      }
    }
  };
