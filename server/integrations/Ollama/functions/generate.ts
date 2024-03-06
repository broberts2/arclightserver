module.exports =
  (modules: { [key: string]: any }) =>
  async (obj: {
    Settings: any;
    msg: {
      prompt: string;
      id?: "string";
      context?: string;
      redirect?: boolean;
    };
  }) => {
    try {
      const redir = obj.msg.redirect;
      delete obj.msg.redirect;
      const res = await modules
        .fetch(
          obj.Settings.settings.model_host && !redir
            ? `http://127.0.0.1:11434/api/generate`
            : `${obj.Settings.apivalues.host_ip}/api/ollama_ask?apitoken=${obj.Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              obj.Settings.settings.model_host && !redir
                ? {
                    stream: false,
                    model: obj.Settings.apivalues.default_model,
                    prompt: obj.msg.prompt,
                    context: obj.msg.context,
                  }
                : obj.msg
            ),
          }
        )
        .then((res: any) => res.json())
        .then((res: any) => {
          res.message = {
            content: res?.response,
          };
          if (res?.message?.content && res?.response)
            res.message.content = res.response.trim();
          delete res.response;
          return res;
        });
      return res;
    } catch (e) {
      console.log(e);
      return "[Failed to connect with ollama]";
    }
  };
