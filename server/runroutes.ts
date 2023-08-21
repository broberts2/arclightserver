module.exports = (modules: any) => async (req: any, res: any) => {
  try {
    const accesstype = req.method.toLowerCase();
    const E = await modules._models.endpoint.findOne({
      accessurl: req.params.endpoint,
      accesstype,
    });
    if (!E) return res.status(404).send("Endpoint not found.");
    if (!req || !req.body) return res.status(401).send("Missing request body.");
    if (!E.script) return res.status(500).send("No script bound to endpoint.");
    if (!modules.Scripts.endpoint[E.script])
      return res.status(500).send("No script found for this endpoint.");
    const metaData =
      typeof req.body.metaData === "string"
        ? JSON.parse(req.body.metaData)
        : req.body.metaData;
    const apitoken =
      (req.query && req.query.apitoken) ||
      (req.body && (req.body.apitoken || metaData?.apitoken));
    delete req.query.apitoken;
    delete req.body.apitoken;
    if (metaData) {
      delete metaData.apitoken;
      req.body.metaData =
        typeof req.body.metaData === "string"
          ? JSON.stringify(metaData)
          : metaData;
    }
    if (!E.nonstrict) {
      if (!apitoken || (apitoken && E.apikeyaccess !== apitoken)) {
        if (!req.body.username || !req.body.password)
          return res
            .status(403)
            .send(
              "Missing/invalid username, password, or API Token in request query/body."
            );
        const U = await modules._models.user.findOne({
          username: req.body.username,
        });
        if (!U) return res.status(401).send("User not found.");
        if (modules.Cryptr.decrypt(U._password) !== req.body.password)
          return res
            .status(403)
            .send("Invalid username or password in request body.");
        if (
          !U.profiles.some((s: string) =>
            E.profileaccess.find((ss: string) => ss === s.toString())
          )
        )
          return res.status(403).send("Forbidden.");
      }
    }
    let query: any;
    if (req.query.query && typeof req.query.query === "string") {
      try {
        query = JSON.parse(req.query.query);
      } catch (e) {
        console.log(e);
      }
    } else if (req.body.query && typeof req.body.query === "object") {
      try {
        query = req.body.query;
      } catch (e) {}
    }
    let skip: any, limit: any, sort: any;
    const recursive = query && typeof query === "object" && query._recursive;
    const tree =
      query && typeof query === "object" && query._tree
        ? query._tree
        : undefined;
    if (recursive) return res.status(403).send("Recursive search forbidden.");
    if (query && typeof query === "object") {
      skip = query._skip;
      limit = query._limit;
      sort = query._sort;
      delete query._skip;
      delete query._limit;
      delete query._sort;
      delete query._tree;
    }
    if (query && Object.keys(query).some((s: string) => s.charAt(0) === "_"))
      return res.status(401).send("Invalid underscore selector in query.");
    if (accesstype === "get") {
      const _res = await eval(modules.Scripts.endpoint[E.script].fn)(modules, {
        query,
        skip,
        limit,
        sort,
        recursive,
        tree,
      });
      return res.json(_res);
    } else if (accesstype === "post") {
      const _res = await eval(modules.Scripts.endpoint[E.script].fn)(modules, {
        query,
        skip,
        limit,
        sort,
        recursive,
        tree,
      });
      return res.json(_res);
    } else if (accesstype === "put") {
      const _res = await eval(modules.Scripts.endpoint[E.script].fn)(modules, {
        query,
        skip,
        limit,
        sort,
        recursive,
        tree,
      });
      return res.json(_res);
    } else if (accesstype === "delete") {
      const _res = await eval(modules.Scripts.endpoint[E.script].fn)(modules, {
        query,
        skip,
        limit,
        sort,
        recursive,
        tree,
      });
      return res.json(_res);
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
};
