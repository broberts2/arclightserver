module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const profile = await models.model.findOne({
    _type: "profile",
  });
  if (!profile)
    await models.model.create(
      Object.assign(
        {
          _type: "profile",
          _system: true,
          _managed: undefined,
          _managedid: undefined,
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          hierarchy: {
            _type: "Number",
            type: Number,
            unique: false,
            required: true,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          text: "Profiles",
          icon: "id-badge",
          subicon: "id-card",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
