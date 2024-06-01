const _exceptionCases = (s: string) => {
  if (s.includes("datamodels")) return "model";
  else if (s.includes("form")) return "form";
  else if (s.includes("formtemplates")) return "form template";
  else if (s.includes("integrations")) return "integrations";
  else if (s.includes("scripts")) return "script";
};

module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (
    io: { [key: string]: any },
    socket: { [key: string]: any },
    operations: { [key: string]: any },
    calls: { [key: string]: any },
    customcalls: { [key: string]: any },
    token?: string
  ) => {
    const v = modules.vanguard(modules, io, socket);
    Object.keys(calls).map((k) => {
      const isAppFn =
        modules &&
        modules.Integrations &&
        Object.keys(modules.Integrations).find((l: string) =>
          modules.Integrations[l].invokables
            ? modules.Integrations[l].invokables.find((Invokable: any) => {
                if (!(Invokable && Invokable.name && Invokable.name === k))
                  return null;
                return Invokable;
              })
            : false
        );
      return Array.isArray(calls[k])
        ? calls[k].map((type: string) => {
            socket.on(`${k}_${type}`, (msg: { [key: string]: any }) => {
              return v(
                token ? token : msg?._token,
                (userId: any) =>
                  isAppFn
                    ? modules.Integrations[isAppFn].invokables
                        .find((Invokable: any) => Invokable.name === k)
                        .fn(msg, io, socket)
                    : operations[k](
                        io,
                        socket
                      )({ ...msg, _model: type, userId }),
                type
              );
            });
          })
        : socket.on(k, (msg: { [key: string]: any }) => {
            let Invokable;
            if (isAppFn) {
              Invokable = modules.Integrations[isAppFn].invokables.find(
                (Invokable: any) => Invokable.name === k
              );
              if (
                Invokable &&
                Invokable.permissions.some((p: string) =>
                  ["publicread"].find((el: string) => el === p)
                )
              )
                return modules.Integrations[isAppFn].invokables
                  .find((Invokable: any) => Invokable.name === k)
                  .fn(msg, io, socket);
            }
            if (
              k === "registeruser" ||
              k === "verifyregisteruser" ||
              k === "identifyself"
            )
              return operations[k](io, socket)(msg);
            v(
              token ? token : msg?._token,
              () =>
                isAppFn
                  ? modules.Integrations[isAppFn].invokables
                      .find((Invokable: any) => Invokable.name === k)
                      .fn(msg, io, socket)
                  : operations[k](io, socket)(msg),
              _exceptionCases(k)
            );
          });
    });
    Object.keys(customcalls).map((k) => {
      calls[k] = true;
      socket.on(k, (msg: { [key: string]: any }) => {
        if (
          k &&
          (modules?.Scripts["custom-call"] ||
            modules?.Scripts["custom-call-admin"])
        ) {
          const script =
            modules.Scripts["custom-call"][k] ||
            modules.Scripts["custom-call-admin"][k];
          if (script && script.metadata && script.fn) {
            v(
              token ? token : msg?._token,
              () => eval(script.fn)(modules, io, socket, msg),
              { type: "custom-call", script: k }
            );
          }
        }
      });
    });
    return calls;
  };
