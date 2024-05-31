module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const article = await models.model.findOne({
    _type: "article",
  });
  if (!article)
    await models.model.create(
      Object.assign(
        {
          _type: "article",
          _system: true,
          views: {},
          title: {
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
          contentblocks: {
            _type: "Array",
            type: Array,
            unique: false,
            required: false,
          },
          author: {
            _type: "String",
            lookup: "user",
            type: String,
            unique: false,
            required: false,
          },
          createddate: {
            _type: "Date",
            type: Date,
            unique: false,
            required: false,
          },
          text: "Articles",
          icon: "feather-pointed",
          subicon: "feather",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "Articles",
        },
        BaseModelMod
      )
    );
};
