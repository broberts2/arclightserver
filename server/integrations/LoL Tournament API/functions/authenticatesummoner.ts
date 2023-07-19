module.exports =
  (Modules: any, publicURI: string) =>
  async (Settings: any, msg: { [key: string]: any }, io: any, socket: any) => {
    let summoner: any;
    if (!msg.puuid) {
      summoner = await Modules.fetch(
        `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${msg.summonername}?api_key=${Settings.apivalues.tournamentapikey}`,
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res: any) => res.json());
      if (summoner.status && summoner.status.status_code >= 300) {
        return io.to(socket.id).emit(`serverwarning`, {
          code: summoner.status.status_code,
          msg: summoner.status.message,
        });
      }
    }
    console.log(summoner);
    const records = await Modules._models[
      Settings.settings.playermodeltype
    ].updateOne(
      { _id: msg._id },
      {
        [Settings.settings.summonerkey]: msg.puuid ? null : msg.summonername,
        [Settings.settings.summonerpuuid]: msg.puuid ? null : summoner.puuid,
      }
    );
    if (records && records.modifiedCount) {
      const user = await Modules._models[
        Settings.settings.playermodeltype
      ].find();
      io.to(socket.id).emit(`getrecords_${Settings.settings.playermodeltype}`, {
        user,
      });
    }
    io.to(socket.id).emit(`serversuccess`, {
      code: 203,
      msg: `Update successful.`,
    });
  };
