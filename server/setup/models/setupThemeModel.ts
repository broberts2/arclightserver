module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const theme = await models.model.findOne({ _type: "theme" });
  if (!theme)
    await models.model.create(
      Object.assign(
        {
          _system: true,
          _type: "theme",
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
          fontfamily: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          primarytextcolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          secondarytextcolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundprimarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundsecondarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundtertiarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundquarternarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          backgroundquinarycolor: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          text: "Themes",
          icon: "paintbrush",
          subicon: "paintbrush",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
