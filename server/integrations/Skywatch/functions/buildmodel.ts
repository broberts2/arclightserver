module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  const WeatherStation = await modules._models.model.findOne({
    _type: "weatherstation",
  });
  if (!WeatherStation)
    await modules._models.model.insertMany({
      _type: "weatherstation",
      _system: true,
      text: "Weather Stations",
      icon: "id-badge",
      subicon: "id-card",
      metaimg: `${modules.globals.publicURI}/static/defaultart/profile.jpg`,
      category: "",
      stationid: {
        _type: "String",
        type: String,
        lookup: null,
        unique: false,
        required: false,
      },
      type: "Feature",
      geometry: {
        _type: "JSON",
        type: String,
        lookup: null,
        unique: false,
        required: false,
      },
      properties: {
        _type: "JSON",
        type: String,
        lookup: null,
        unique: false,
        required: false,
      },
    });
};
