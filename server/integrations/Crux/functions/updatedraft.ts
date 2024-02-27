module.exports =
  (modules: any, publicURI: string) =>
  (_id: string, io: any, socket: any) =>
  async (draft: any) => {
    if (modules.Integrations.Crux.Settings.active) {
      try {
        await modules._models.cruxdraft.updateMany({ _id }, draft);
        const Draft = await modules._models.cruxdraft.findOne({ _id });
        return Draft;
      } catch (e) {
        console.log(e);
        return io
          .to(socket.id)
          .emit(`servererror`, { code: 500, msg: "Couldn't update draft." });
      }
    }
  };
