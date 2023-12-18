module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const settings = await models.model.findOne({ _type: "settings" });
  if (!settings)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "settings",
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          userregistration: {
            _type: "Boolean",
            type: Boolean,
            unique: false,
            required: false,
          },
          text: "Settings",
          icon: "gears",
          subicon: "gear",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
