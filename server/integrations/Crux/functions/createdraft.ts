module.exports = (modules: any, publicURI: string) => async (msg: any) => {
  const _t = () =>
    Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
  if (modules.Integrations.Crux.Settings.active) {
    const p = undefined; // reserved for partnership name
    const bluetoken = _t();
    const redtoken = _t();
    const _Draft = await modules._models.cruxdraft
      .insertMany({
        name: new Date().toString(),
        img: `https://highmountainlabs.io/arclight/cdn/media/crux.jpg`,
        theme: undefined,
        cruxorg: undefined,
        events: undefined,
        data: undefined,
      })
      .then((res: any) => res[0]);
    const bt = btoa(
      JSON.stringify({ id: _Draft._id.toString(), k: bluetoken })
    );
    const rt = btoa(JSON.stringify({ id: _Draft._id.toString(), k: redtoken }));
    const st = btoa(JSON.stringify({ id: _Draft._id.toString() }));
    await modules._models.cruxdraft.updateOne(
      {
        _id: _Draft._id.toString(),
      },
      {
        data: JSON.stringify({
          createddate: new Date().toString(),
          bluetoken,
          redtoken,
          links: {
            bluelink:
              process.env.NODE_ENV === "production"
                ? `https://crux.highmountainlabs.io/cruxdraft${
                    p ? `/${p}` : ""
                  }?d=${bt}`
                : `http://localhost:3000/cruxdraft${p ? `/${p}` : ""}?d=${bt}`,
            redlink:
              process.env.NODE_ENV === "production"
                ? `https://crux.highmountainlabs.io/cruxdraft${
                    p ? `/${p}` : ""
                  }?d=${rt}`
                : `http://localhost:3000/cruxdraft${p ? `/${p}` : ""}?d=${rt}`,
            spectatorlink:
              process.env.NODE_ENV === "production"
                ? `https://crux.highmountainlabs.io/cruxdraft${
                    p ? `/${p}` : ""
                  }?d=${st}`
                : `http://localhost:3000/cruxdraft${p ? `/${p}` : ""}?d=${st}`,
          },
        }),
      }
    );
    const Draft = await modules._models.cruxdraft.findOne({
      _id: _Draft._id.toString(),
    });
    return {
      success: "true",
      links: JSON.parse(Draft.data).links,
    };
  }
};
