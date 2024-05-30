const _k =
  (msg: { [key: string]: any }, model: { [key: string]: any }, k: string) =>
  (key: string) => {
    const val =
      msg[k] && msg[k][key]
        ? msg[k][key]
        : model[k] && model[k][key] && msg[k][key]
        ? model[k]._type
        : null;
    return val;
  };

module.exports = (_buildModels: Function) => ({
  reduce: (msg: any, model?: { [key: string]: any }, newModel?: boolean) => {
    const UpdateObj: { [key: string]: any } = {};
    const a = (a: any, k: string) => {
      if (typeof a === "object" && model) {
        const __k = _k(msg, model, k);
        UpdateObj[
          msg[k] && msg[k].key && msg[k].key !== k
            ? (() => {
                UpdateObj[k] = null;
                return msg[k].key;
              })()
            : k
        ] = msg[k]
          ? {
              _type:
                msg[k] && msg[k].type
                  ? msg[k].type
                  : model[k] && model[k]._type
                  ? model[k]._type
                  : null,
              lookup: __k("lookup"),
              adminlookup: __k("adminlookup"),
              unique: __k("unique"),
              required: __k("required"),
            }
          : null;
      } else UpdateObj[k] = a;
    };
    Object.keys(msg).map((k: string) => {
      if (newModel && k === "type") UpdateObj._type = msg[k];
      else if (k.slice(0, 1) !== "_") return a(msg[k], k);
      return null;
    });
    return UpdateObj;
  },
  restrictions: (io: any, socket: any, msg: any) => {
    //console.log(msg);
  },
  rebuildModels: () => {
    //_buildModels();
  },
});
