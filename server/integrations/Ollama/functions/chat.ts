module.exports = (modules: { [key: string]: any }) => async (obj: any) => {
  const encryption = true;
  try {
    if (!obj.Settings.settings.model_host) {
      const res = await await modules
        .fetch(
          `${obj.Settings.apivalues.host_ip}/api/ollama_chat?apitoken=${obj.Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              msg: { ...obj.msg },
            }),
          }
        )
        .then((res: any) => res.json());
      return res;
    }
    let newId = undefined;
    let Conversation: any;
    if (obj.msg.id) {
      Conversation = await modules._models.ollama_conversation.findOne({
        _id: obj.msg.id,
      });
    } else {
      Conversation = await modules._models.ollama_conversation
        .insertMany({
          img: "https://highmountainlabs.io/cdn/arclight/media/ollama.jpg",
          history: [],
        })
        .then((res: any) => res[0]);
      newId = Conversation._id.toString();
    }
    if (Conversation?.history?.length) {
      const messages: any = {};
      await modules._models.ollama_message
        .find({ _id: { $in: Conversation.history } })
        .then((arr: any) =>
          arr.map(
            (message: any) => (messages[message._id.toString()] = message)
          )
        );
      Conversation.history = Conversation.history.map(
        (s: string) => messages[s]
      );
    }
    const res = await modules
      .fetch(`http://127.0.0.1:11434/api/chat`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stream: false,
          model: obj.Settings.apivalues.default_model,
          messages: (Conversation?.history
            ? Conversation.history.map((C: any) => ({
                role: C.role,
                content: encryption
                  ? modules.Cryptr.decrypt(C.content)
                  : C.content,
              }))
            : []
          ).concat({
            role: "user",
            content: obj.msg.prompt,
          }),
        }),
      })
      .then((res: any) => res.json())
      .then(async (res: any) => {
        if (res?.message?.content)
          res.message.content = res.message.content.trim();
        if (!obj.msg.init && Conversation?._id) {
          if (res?.message?.content) {
            const UserMessage = await modules._models.ollama_message
              .insertMany({
                img: "https://highmountainlabs.io/cdn/arclight/media/ollama.jpg",
                role: "user",
                content: encryption
                  ? modules.Cryptr.encrypt(res.message.content)
                  : obj.msg.prompt,
              })
              .then((res: any) => res[0]);
            const AssistantMessage = await modules._models.ollama_message
              .insertMany({
                img: "https://highmountainlabs.io/cdn/arclight/media/ollama.jpg",
                role: "assistant",
                content: encryption
                  ? modules.Cryptr.encrypt(res.message.content)
                  : res.message.content,
              })
              .then((res: any) => res[0]);
            await modules._models.ollama_conversation.updateOne(
              { _id: Conversation._id.toString() },
              {
                $push: {
                  history: {
                    $each: [
                      UserMessage._id.toString(),
                      AssistantMessage._id.toString(),
                    ],
                  },
                },
              }
            );
          }
        }
        return res;
      });
    return { ...res, newId };
  } catch (e) {
    console.log(e);
    return "[Failed to connect with ollama]";
  }
};
