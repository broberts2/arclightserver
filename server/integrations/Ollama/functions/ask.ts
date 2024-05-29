const CHAT_MODE: string = "chat";

module.exports =
  (modules: { [key: string]: any }) =>
  async (msg: {
    prompt: string;
    context?: string;
    init?: boolean;
    id?: string;
    redirect?: boolean;
  }) => {
    try {
      const context =
        msg.id && !msg.redirect
          ? await modules._models.ollama_conversation
              .findOne({ _id: msg.id })
              .then((res: any) => res.history)
          : [];
      const res = await modules.Integrations.Ollama[CHAT_MODE]({
        ...msg,
        context,
      });
      if (!msg.init && !msg.id && !msg.redirect) {
        const Conversation = await modules._models.ollama_conversation
          .insertMany({
            category: "",
            icon: "comments",
            subicon: "comments",
            name: "ollama_conversation",
            img: "https://highmountainlabs.io/cdn/arclight/media/ollama.jpg",
            history: [
              { role: "user", content: msg.prompt },
              { role: "assistant", content: res.message.content },
            ],
          })
          .then((res: any) => res[0]);
        res.ollama_chat_session_id = Conversation._id.toString();
      } else if (msg.id && !msg.redirect) {
        await modules._models.ollama_conversation.updateOne(
          { _id: msg.id },
          CHAT_MODE === "chat"
            ? {
                $push: {
                  history: {
                    $each: [
                      { role: "user", content: msg.prompt },
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
      return res;
    } catch (e) {
      console.log(e);
    }
  };
