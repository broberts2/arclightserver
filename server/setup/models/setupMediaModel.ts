module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const media = await models.model.findOne({
    _type: "media",
  });
  if (!media)
    await models.model.create(
      Object.assign(
        {
          _type: "media",
          _system: true,
          _parent: false,
          _isdirectory: false,
          _ext: false,
          name: {
            _type: "String",
            type: String,
            unique: true,
            required: true,
          },
          url: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          text: "Media",
          icon: "photo-film",
          subicon: "photo-film",
          metaimg: `https://highmountainlabs.io/arclight/cdn/media/media.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
