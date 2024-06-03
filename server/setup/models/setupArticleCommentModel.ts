module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const articlecomment = await models.model.findOne({
    _type: "articlecomment",
  });
  if (!articlecomment)
    await models.model.create(
      Object.assign(
        {
          _type: "articlecomment",
          _system: true,
          name: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          img: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          content: {
            _type: "String",
            type: String,
            unique: false,
            required: false,
          },
          articleowner: {
            _type: "String",
            lookup: "article",
            type: String,
            unique: false,
            required: false,
          },
          commentowner: {
            _type: "String",
            lookup: "articlecomment",
            type: String,
            unique: false,
            required: false,
          },
          owner: {
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
          updateddate: {
            _type: "Date",
            type: Date,
            unique: false,
            required: false,
          },
          text: "Comments",
          icon: "feather-pointed",
          subicon: "comments",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "Articles",
        },
        BaseModelMod
      )
    );
};
