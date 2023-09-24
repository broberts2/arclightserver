module.exports =
  (Modules: any, publicURI: string) =>
  async (Settings: any, msg: { [key: string]: any }, io: any, socket: any) => {
    let summoner: any;
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
    if (!Modules._models["(M) summoner"])
      return io.to(socket.id).emit(`servererror`, {
        code: 503,
        msg: `Corrupted or missing summoner model.`,
      });
    const Summoners = await Modules._models["(M) summoner"].find({
      puuid: summoner.puuid,
    });
    if (Summoners && Summoners.length)
      return io.to(socket.id).emit(`serverwarning`, {
        code: 500,
        msg: `Summoner already exists.`,
      });
    const S = await Modules._models["(M) summoner"]
      .insertMany({
        img: `http://highmountainlabs.io/arclight/cdn/media/summoner.jpg`,
        name: `(M) ${summoner.name}`,
        puuid: summoner.puuid,
        profileIconId: summoner.profileIconId,
        user: msg.user,
        _managed: "LoL Tournament API",
      })
      .then((r: any) => r[0]);
    await Modules._models[Settings.settings.usermodeltype].updateOne(
      { _id: msg.user },
      { $push: { [Settings.settings.summonerkey]: S._id } }
    );
    io.to(socket.id).emit(`serversuccess`, {
      code: 203,
      msg: `Summoner created.`,
    });
  };
