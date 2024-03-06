module.exports =
  (modules: { [key: string]: any }) =>
  async (obj: {
    Settings: any;
    msg: {
      prompt: string;
      id?: "string";
      context?: Array<{
        role: string;
        content: string;
      }>;
    };
  }) => {
    try {
      const res = await modules
        .fetch(
          obj.Settings.settings.model_host
            ? `http://127.0.0.1:11434/api/chat`
            : `${obj.Settings.apivalues.host_ip}/api/ollama_ask?apitoken=${obj.Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stream: false,
              model: obj.Settings.apivalues.default_model,
              messages: obj.msg.context
                ? obj.msg.context.concat({
                    role: "user",
                    content: obj.msg.prompt,
                  })
                : undefined,
            }),
          }
        )
        .then((res: any) => res.json())
        .then((res: any) => {
          res.message.content = res.message.content.trim();
          return res;
        });
      return res;
    } catch (e) {
      console.log(e);
      return "[Failed to connect with ollama]";
    }
  };
