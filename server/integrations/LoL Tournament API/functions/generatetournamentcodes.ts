module.exports =
  (Modules: any, publicURI: string) =>
  async (Settings: any, msg: { [key: string]: any }, io: any, socket: any) => {
    console.log(msg);
    let eFlag: { msg: string; code: number } | boolean = false;
    const pms = [];
    const c: any = async (gameNum: number) =>
      await Modules.fetch(
        `https://americas.api.riotgames.com/lol/tournament/v4/codes?tournamentId=${Settings.apivalues.tournamentid}&api_key=${Settings.apivalues.tournamentapikey}`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            //@ts-ignore
            mapType: "SUMMONERS_RIFT",
            metadata: JSON.stringify({
              team1: msg.team1,
              team2: msg.team2,
              weekNum: msg.weekNum,
              gameNum,
              seasonNum: msg.seasonNum,
              league: msg.league,
            }),
            pickType: "TOURNAMENT_DRAFT",
            spectatorType: "ALL",
            teamSize: 5,
          }),
        }
      ).then((res: any) => res.json());
    const codes: { [key: string]: string } = {};
    for (let i = 0; i < msg.count; i++)
      pms.push(async () => {
        if (eFlag) return;
        const cc = await c(i + 1);
        if (cc.status && cc.status.status_code >= 300)
          eFlag = {
            code: cc.status.status_code,
            msg: cc.status.message,
          };
        else codes[`Game ${i + 1}`] = cc[0];
      });
    await Promise.all(pms.map(async (p: Function) => await p()));
    if (!eFlag) {
      const _c: { [key: string]: any } = {};
      Object.keys(codes)
        .sort((j: string, k: string) => (j < k ? -1 : 1))
        .map((k: string) => (_c[k] = codes[k]));
      io.to(socket.id).emit(`generatetournamentcodes`, {
        generatetournamentcodes: {
          ...msg,
          JSON: JSON.stringify(_c),
        },
      });
    }
    if (eFlag)
      return io.to(socket.id).emit(`servererror`, {
        //@ts-ignore
        code: eFlag.code,
        //@ts-ignore
        msg: eFlag.msg,
      });
    io.to(socket.id).emit(`serversuccess`, {
      code: 201,
      msg: `Create successful.`,
    });
  };
