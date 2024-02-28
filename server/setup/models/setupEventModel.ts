module.exports = async (
  models: any,
  BaseModelMod: any,
  publicURI: string,
  HMLCDN: string
) => {
  const event = await models.model.findOne({
    _type: "event",
  });
  if (!event)
    await models.model.create(
      Object.assign(
        {
          _type: "event",
          _system: true,
          type: {
            _type: "String",
            type: String,
            unique: false,
            required: true,
          },
          startDate: {
            _type: "Date",
            type: Date,
            unique: false,
            required: true,
          },
          endDate: {
            _type: "Date",
            type: Date,
            unique: false,
            required: true,
          },
          title: {
            _type: "String",
            type: String,
            unique: false,
            required: true,
          },
          imgUrl: {
            _type: "String",
            type: String,
            unique: false,
            required: true,
          },
          json: {
            _type: "JSON",
            type: String,
            unique: false,
            required: true,
          },
          recurrence: {
            _type: "String",
            type: String,
            unique: false,
            required: true,
          },
          script: {
            _type: "String",
            type: String,
            unique: false,
            required: true,
            lookup: "script",
          },
          text: "Events",
          icon: "calendar",
          subicon: "calendar",
          metaimg: `https://highmountainlabs.io/cdn/arclight/media/datamodel.jpg`,
          category: "",
        },
        BaseModelMod
      )
    );
};
