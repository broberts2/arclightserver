module.exports = (Modules: any, publicURI: string) => async (Settings: any) => {
  if (Settings.active) {
    Modules.Integrations.Ollama.runningids = [];
    const Conversation = await Modules._models.model.findOne({
      _type: "ollama_conversation",
    });
    if (!Conversation) {
      await Modules._models.model.insertMany({
        _system: false,
        _managed: "Ollama",
        _type: "ollama_conversation",
        text: "ollama_conversation",
        metaimg: `https://highmountainlabs.io/cdn/arclight/media/ollama.jpg`,
        category: "",
        icon: "comments",
        subicon: "comments",
        name: {
          _type: "String",
          lookup: null,
          unique: null,
          required: true,
        },
        img: {
          _type: "String",
          lookup: null,
          unique: null,
          required: true,
        },
        history: {
          _type: "Array",
          lookup: null,
          unique: null,
          required: true,
        },
      });
    }
    // const Collection = await Modules._models.model.findOne({
    //   _type: "ollama_collection",
    // });
    // if (!Collection) {
    //   await Modules._models.model.insertMany({
    //     _system: false,
    //     _managed: "Ollama",
    //     _type: "ollama_collection",
    //     text: "ollama_collection",
    //     metaimg: `https://highmountainlabs.io/cdn/arclight/media/ollama.jpg`,
    //     category: "",
    //     icon: "box-open",
    //     subicon: "box-open",
    //     name: {
    //       _type: "String",
    //       lookup: null,
    //       unique: null,
    //       required: true,
    //     },
    //     img: {
    //       _type: "String",
    //       lookup: null,
    //       unique: null,
    //       required: true,
    //     },
    //   });
    // }
  }
  if (!Settings.active) {
    await Promise.all(
      ["ollama_conversation", "ollama_message"].map(async (_type: string) => {
        const P = await Modules._models.model.findOne({
          _type,
        });
        if (P) {
          await Modules._models.model.deleteOne({
            _type,
          });
        }
      })
    );
  }
};
