module.exports =
  (modules: any, publicURI: string) =>
  async (msg: any, io: any, socket: any) => {
    if (modules.Integrations.Crux.Settings.active) {
      try {
        const _ = JSON.parse(atob(msg.query.d));
        let Draft = await modules._models.cruxdraft.findOne({ _id: _.id });
        if (!Draft) return;
        if (!Draft.blueready)
          await modules._models.cruxdraft.updateMany(
            { _id: _.id },
            {
              blueready:
                JSON.parse(Draft.data).bluetoken === _.k && !Draft.blueready,
            }
          );
        if (!Draft.redready)
          await modules._models.cruxdraft.updateMany(
            { _id: _.id },
            {
              redready:
                JSON.parse(Draft.data).redtoken === _.k && !Draft.redready,
            }
          );
        Draft = await modules._models.cruxdraft.findOne({ _id: _.id });
        if (Draft.blueready && Draft.redready && !Draft.stage) {
          modules.Integrations.Crux.kickOff(_.id, io, socket);
        } else {
          return io.to(_.id).emit(`crux_draft`, Draft);
        }
      } catch (e) {
        console.log(e);
        return io
          .to(socket.id)
          .emit(`servererror`, { code: 500, msg: "Couldn't find draft data." });
      }
    }
  };
