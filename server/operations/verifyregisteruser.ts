module.exports =
  (
    modules: { [key: string]: any },
    name: string,
    transforms: { [key: string]: Function }
  ) =>
  (io: { [key: string]: any }, socket: { [key: string]: any }) =>
  async (msg: { [key: string]: any }) => {
    let records;
    msg._model = "user";
    const R = await modules._models.settings.findOne({ name: "default" });
    if (!R || !R.userregistration) return;
    let DSel;
    try {
      DSel = JSON.parse(atob(msg.v));
    } catch (e) {
      return io.to(socket.id).emit(`servererror`, {
        code: 401,
        msg: `Malformed token.`,
      });
    }
    const U = await modules._models.user.findOne({
      _id: DSel.id,
      _unverified: true,
    });
    if (!U)
      return io.to(socket.id).emit(`servererror`, {
        code: 400,
        msg: `Sign-up link invalid or expired.`,
      });
    const beforeCreate = await modules.runScripts(
      "before-create",
      io,
      socket
    )({ msg, records: null });
    if (beforeCreate && !beforeCreate.success)
      throw new Error(`Script Error: ${beforeCreate.error}`);
    const auth = msg.password === modules.Cryptr.decrypt(DSel.p);
    if (!auth)
      return io.to(socket.id).emit(`servererror`, {
        code: 403,
        msg: `User password was incorrect.`,
      });
    records = await modules._models.user.updateOne(
      { _id: U._id },
      { $unset: { _unverified: true } }
    );
    const after = records
      ? await modules._models.user.find({
          _id: U._id.toString(),
        })
      : [];
    const afterCreate = await modules.runScripts(
      "after-create",
      io,
      socket
    )({ msg, records: { after } });
    if (afterCreate && !afterCreate.success)
      throw new Error(`Script Error: ${afterCreate.error}`);
    const UU = await modules._models.user.findOne({ _id: U._id.toString() });
    io.to(socket.id).emit(`verifyregisteruser`, {
      ...UU._doc,
      _password: undefined,
      __v: undefined,
      _token: modules.jwt.sign({ _: U._id.toString() }),
      _unverified: undefined,
    });
    io.to(socket.id).emit(`clearurlparameters`);
    return io.to(socket.id).emit(`serversuccess`, {
      code: 203,
      msg: `User registration successful.`,
    });
  };
