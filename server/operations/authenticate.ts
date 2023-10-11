const c = (b: boolean, k: string, n: number) => {
  if (n === 1 && k === "getrecords") return b;
  else if (n === 2 && (k === "getrecords" || k === "updaterecords")) return b;
  else if (
    n === 3 &&
    (k === "getrecords" ||
      k === "updaterecords" ||
      k === "createrecords" ||
      k === "deleterecords" ||
      k === "executerecords")
  )
    return b;
  return false;
};

const codefetch = async (
  modules: { [key: string]: string },
  obj: { [key: string]: string }
) => {
  if (obj.type === "Discord" && obj.code) {
    //@ts-ignore
    const user = await modules.Integrations.Discord.identify(
      require(`${modules.rootDirectory}/integrations.json`).Discord,
      obj
    );
    if (user) return user;
    return false;
  }
  return false;
};

module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  async (
    io: any,
    socket: any,
    msg: { [key: string]: any },
    savetoken: Function,
    cleartoken: Function,
    noauth: Function,
    cb: Function
  ) => {
    let token;
    let u: { [key: string]: any } | null = null;
    const key = (s: string, m: boolean) => {
      const _: string = m ? `datamodels` : `records`;
      switch (s) {
        case "create":
          return `create${_}`;
        case "read":
          return `get${_}`;
        case "edit":
          return `update${_}`;
        case "delete":
          return `delete${_}`;
        case "execute":
          return `execute${_}`;
      }
    };
    const calls: { [key: string]: any } = {};
    const customcalls: { [key: string]: any } = {};
    if (msg.type) {
      const identity = await codefetch(modules, msg);
      if (!identity) noauth(`Invalid OATH2 code.`);
      u = await modules._models.user.findOne({
        _managedid: identity.id,
      });
      if (u) token = savetoken(modules.jwt.sign({ _: u._id }));
    } else if (!msg._token && msg.username && msg.password) {
      u = await modules._models.user.findOne({
        username: msg.username,
      });
      if (u && modules.Cryptr.decrypt(u._password) === msg.password)
        token = savetoken(modules.jwt.sign({ _: u._id }));
      else noauth(`Invalid Username or Password.`);
    } else if (!msg._token) {
      io.to(socket.id).emit("cleartoken");
      if (!msg.username) noauth(`Username required.`);
      else if (!msg.password) noauth(`Password required.`);
    } else if (msg._token) {
      const t = modules.jwt.verify(msg._token);
      if (t && t.code === 200)
        u = await modules._models.user.findOne({
          _id: t.data._,
        });
    }
    if (u && u.profiles)
      u.profiles = u.profiles
        .filter((_p: any) => _p)
        .map((_p: any) => _p.toString());
    const permissions = await modules._models.permissions.find();
    permissions.map((p: any) => {
      return ["create", "read", "edit", "delete", "execute"].map((s: string) =>
        p[s]
          ? p[s]
              .filter((s: string) => s)
              .map((id: string) => {
                const k = key(s, p.name === "model");
                if (k) {
                  if (
                    (u && u.profiles && u.profiles.includes(id.toString())) ||
                    ((p.publicread || p.ownerread) && s === "read") ||
                    ((p.publiccreate || p.ownercreate) && s === "create") ||
                    ((p.publicedit || p.owneredit) && s === "edit") ||
                    ((p.publicdelete || p.ownerdelete) && s === "delete")
                  ) {
                    if (
                      c(p.name === "logs", k, 1) ||
                      c(p.name === "integrations", k, 2) ||
                      c(p._app, k, 3) ||
                      c(p.name === "script", k, 3) ||
                      c(p.name === "form", k, 3) ||
                      c(p.name === "form template", k, 3)
                    ) {
                      let n =
                        p.name.slice(-1) === "s"
                          ? p.name.slice(0, p.name.length - 1)
                          : p.name;
                      const __key = k.replace("records", `${n}s`);
                      calls[
                        __key.includes("form") ? __key.replace(/ /g, "") : __key
                      ] = true;
                      n = n.replace("(M) ", "");
                      if (
                        modules &&
                        modules.Integrations &&
                        modules.Integrations[n] &&
                        modules.Integrations[n].invokables
                      )
                        modules.Integrations[n].invokables.map(
                          (invokable: any) => {
                            if (invokable.permissions.includes(s))
                              calls[invokable.name] = true;
                          }
                        );
                    } else if (
                      !["integrations", "script"].find(
                        (el: string) => p.name === el
                      )
                    ) {
                      if (!calls[k]) calls[k] = p.name === "model" ? true : [];
                      if (p.name !== "model") {
                        if (p.recursiveinit) {
                          if (!calls.recursiveinit) calls.recursiveinit = [];
                          if (
                            !calls.recursiveinit.find(
                              (s: string) => s === p.name
                            )
                          )
                            calls.recursiveinit.push(p.name);
                        }
                        return calls[k].push(p.name);
                      }
                    }
                  }
                }
                if (modules && modules.Integrations)
                  Object.keys(modules.Integrations).map((k: string) => {
                    if (
                      modules &&
                      modules.Integrations &&
                      modules.Integrations[k] &&
                      modules.Integrations[k].invokables
                    )
                      modules.Integrations[k].invokables.map(
                        (invokable: any) => {
                          if (calls[invokable.name]) return;
                          if (invokable.permissions.includes(`public${s}`))
                            calls[invokable.name] = true;
                        }
                      );
                  });
              })
          : null
      );
    });
    const R = await modules._models.settings.findOne({ name: "default" });
    if (R && R.userregistration) {
      calls.registeruser = true;
      calls.verifyregisteruser = true;
    }
    if (modules?.Scripts && modules.Scripts["custom-call"]) {
      const userProfileNames =
        u && u.profiles
          ? await modules._models.profile
              .find({ _id: { $in: u.profiles } })
              .then((p: any) => p.map((profile: any) => profile.name))
          : undefined;
      await Promise.all(
        Object.keys(modules.Scripts["custom-call"]).map(async (s: string) => {
          if (
            modules.Scripts["custom-call"][s] &&
            modules.Scripts["custom-call"][s].metadata
          ) {
            let metadata: any;
            try {
              metadata = JSON.parse(modules.Scripts["custom-call"][s].metadata);
            } catch (e) {}
            if (metadata && metadata.active) {
              if (
                (metadata.profiles && !metadata.profiles.length) ||
                (userProfileNames &&
                  userProfileNames.some((uP: string) =>
                    metadata.profiles.includes(uP)
                  ))
              ) {
                customcalls[s] = true;
              }
            }
          }
        })
      );
    }
    if (msg && msg.redirect && u)
      io.to(socket.id).emit("redirect", { route: "/" });
    Object.keys(calls).map((k: string) => {
      if (Array.isArray(calls[k])) calls[k] = [...new Set(calls[k])];
    });
    Object.keys(customcalls).map((k: string) => {
      if (Array.isArray(customcalls[k]))
        customcalls[k] = [...new Set(customcalls[k])];
    });
    cb(calls, customcalls, token);
  };
