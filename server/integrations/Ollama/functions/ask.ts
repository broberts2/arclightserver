const CHAT_MODE = "chat";

module.exports =
  (modules: { [key: string]: any }) =>
  async (obj: {
    Settings: any;
    msg: { prompt: string; context?: string; init?: boolean; id?: string };
  }) => {
    console.log(`received - ${JSON.stringify(obj.msg)}`);
    try {
      const context = obj.msg.id
        ? await modules._models.ollama_conversation
            .findOne({ _id: obj.msg.id })
            .then((res: any) => res.history)
        : [];
      const res = await modules.Integrations.Ollama[
        CHAT_MODE === "chat" ? "chat" : "generate"
      ]({
        Settings: obj.Settings,
        msg: { ...obj.msg, context },
      });
      if (!obj.msg.init && !obj.msg.id) {
        const Conversation = await modules._models.ollama_conversation
          .insertMany({
            category: "",
            icon: "comments",
            subicon: "comments",
            name: "ollama_conversation",
            img: "https://highmountainlabs.io/cdn/arclight/media/ollama.jpg",
            history: [
              { role: "user", content: obj.msg.prompt },
              { role: "assistant", content: res.message.content },
            ],
          })
          .then((res: any) => res[0]);
        res.ollama_chat_session_id = Conversation._id.toString();
      } else if (obj.msg.id) {
        await modules._models.ollama_conversation.updateOne(
          { _id: obj.msg.id },
          CHAT_MODE === "chat"
            ? {
                $push: {
                  history: {
                    $each: [
                      { role: "user", content: obj.msg.prompt },
                      { role: "assistant", content: res.message.content },
                    ],
                  },
                },
              }
            : {
                history: res.context,
              }
        );
      }
      delete res.context;
      console.log(
        `-------------------                         -------------------------------`
      );
      console.log(`finished - ${JSON.stringify(res)}`);
      return res;
    } catch (e) {
      console.log(e);
    }
  };
