module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const user = await models.model.findOne({
    _type: "user",
  });
  if (!user)
    await models.model.create(
      Object.assign(
        {
          _type: "user",
          _system: true,
          username: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          _password: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          profiles: {
            lookup: "profile",
            _type: "Array",
            type: Array,
            unique: false,
            required: false,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          text: "Users",
          icon: "users",
          subicon: "user-gear",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
