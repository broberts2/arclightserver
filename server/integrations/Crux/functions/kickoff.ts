const executionorder = require("../executionorder");

module.exports =
  (modules: any, publicURI: string) =>
  async (_id: string, io: any, socket: any) => {
    if (
      modules.Integrations.Crux.Settings.active &&
      !modules.Integrations.Crux.___runningdrafts[_id]
    ) {
      modules.Integrations.Crux.___runningdrafts[_id] = true;
      try {
        const updateDraft = modules.Integrations.Crux.updateDraft(
          _id,
          io,
          socket
        );
        const id = setInterval(async () => {
          let Draft = await modules._models.cruxdraft.findOne({ _id });
          if (Draft) {
            if (Draft.transitiontime) {
              Draft = await updateDraft({
                duration: Draft.duration + 1,
                transitiontime: Draft.transitiontime - 1,
              });
            } else if (!Draft.stage) {
              Draft = await updateDraft({
                stage: "lobbytransition",
                transitiontime: 3,
              });
            } else if (Draft.stage === "lobbytransition") {
              Draft = await updateDraft({
                $unset: { blueready: 1, redready: 1 },
                stage: "draftsetup",
                transitiontime: 2,
                nextevent: executionorder.prodraft[0],
              });
            } else if (Draft.stage === "draftsetup") {
              Draft = await updateDraft({
                stage: "active",
                duration: 0,
                timer: JSON.parse(Draft.data).timerseconds,
                timeroverflow: JSON.parse(Draft.data).timeroverflow,
                $unset: { transitiontime: 1 },
              });
            } else if (Draft.stage === "postchampionselect") {
              Draft = await updateDraft({
                stage: "active",
                duration: Draft.duration + 1,
              });
            } else if (
              !Draft.events ||
              Draft.events.length < Object.keys(executionorder.prodraft).length
            ) {
              if (!Draft.events) Draft.events = [];
              if (Draft.timer <= -Draft.timeroverflow) {
                io.to(_id).emit(`lock_action`);
                Draft.events.push({
                  ...executionorder.prodraft[
                    Draft.events.length ? Draft.events.length : 0
                  ],
                  key: 39,
                  time: new Date(),
                });
                io.to(_id).emit(
                  `play_sfx`,
                  Draft.nextevent.action === "pick" ? "choose" : "ban"
                );
                io.to(_id).emit(`play_audio`, {
                  key: `39`,
                  action: Draft.nextevent.action === "pick" ? "choose" : "ban",
                });
                Draft = await updateDraft({
                  stage: "postchampionselect",
                  duration: Draft.duration + 1,
                  transitiontime: 2,
                  timer: JSON.parse(Draft.data).timerseconds,
                  events: Draft.events,
                  nextevent:
                    Draft.events.length <
                    Object.keys(executionorder.prodraft).length
                      ? executionorder.prodraft[Draft.events.length]
                      : null,
                });
              } else {
                Draft = await updateDraft({
                  duration: Draft.duration + 1,
                  timer: Draft.timer - 1,
                });
              }
            } else {
              Draft = await updateDraft({
                stage: "complete",
                $unset: { nextevent: 1, timer: 1, timeroverflow: 1 },
              });
            }
          }
          if (!Draft || Draft.stage === "complete") {
            console.log(`${_id} - complete`);
            clearInterval(id);
            delete modules.Integrations.Crux.___runningdrafts[_id];
          }
          io.to(_id).emit(`crux_draft`, Draft);
        }, 1000);
      } catch (e) {
        return io
          .to(socket.id)
          .emit(`servererror`, { code: 500, msg: "Couldn't start draft." });
      }
    }
  };
