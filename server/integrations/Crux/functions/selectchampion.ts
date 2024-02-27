const executionorder2 = require("../executionorder");

module.exports =
  (modules: any, publicURI: string) =>
  async (msg: any, io: any, socket: any) => {
    if (modules.Integrations.Crux.Settings.active) {
      const state = JSON.parse(atob(msg.state));
      let Draft = await modules._models.cruxdraft.findOne({
        _id: state.id,
      });
      if (!Draft) return;
      const blueside = JSON.parse(Draft.data).bluetoken === state.k;
      const redside = JSON.parse(Draft.data).redtoken === state.k;
      if (!blueside && !redside) return;
      if (!Draft.nextevent) return;
      if (
        (Draft.nextevent.side === "blue" && blueside) ||
        (Draft.nextevent.side === "red" && redside)
      ) {
        if (!Draft.events) Draft.events = [];
        Draft.events.push({
          ...executionorder2.prodraft[
            Draft.events.length ? Draft.events.length : 0
          ],
          key: parseInt(msg.champion.key),
          time: new Date(),
        });
        io.to(state.id).emit(
          `play_sfx`,
          Draft.nextevent.action === "pick" ? "choose" : "ban"
        );
        io.to(state.id).emit(`play_audio`, {
          key: `${msg.champion.key}`,
          action: Draft.nextevent.action === "pick" ? "choose" : "ban",
        });
        Draft = await modules._models.cruxdraft
          .updateMany(
            { _id: state.id },
            {
              stage: "postchampionselect",
              duration: Draft.duration + 1,
              timer: JSON.parse(Draft.data).timerseconds,
              transitiontime: 2,
              events: Draft.events,
              nextevent:
                Draft.events.length <
                Object.keys(executionorder2.prodraft).length
                  ? executionorder2.prodraft[Draft.events.length]
                  : null,
            }
          )
          .then((arr: any) => arr[0]);
      }
      Draft = await modules._models.cruxdraft.findOne({ _id: state.id });
      io.to(state.id).emit(`crux_draft`, Draft);
      io.to(state.id).emit(`lock_action`);
    }
  };
