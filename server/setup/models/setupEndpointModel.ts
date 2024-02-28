module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const endpoint = await models.model.findOne({ _type: "endpoint" });
  if (!endpoint)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "endpoint",
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
          script: "",
          accessurl: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          accesstype: "",
          profileaccess: {
            lookup: "profile",
            _type: "Array",
            type: Array,
            unique: false,
            required: false,
          },
          apikeyaccess: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          nonstrict: {
            _type: "Boolean",
            type: Boolean,
            unique: false,
            required: false,
          },
          text: "Endpoints",
          icon: "circle-nodes",
          subicon: "circle-nodes",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
