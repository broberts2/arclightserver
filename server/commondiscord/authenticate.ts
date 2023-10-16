module.exports =
  (D: { [key: string]: any }) =>
  (API: { [key: string]: any }) =>
  async (t: number) =>
    await D.login(t);
