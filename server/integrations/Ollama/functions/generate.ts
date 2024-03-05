module.exports =
  (modules: { [key: string]: any }) =>
  async (Settings: any, prompt: string) => {
    try {
      const res = await modules
        .fetch(
          Settings.settings.model_host
            ? `http://127.0.0.1:11434/api/generate`
            : `${Settings.apivalues.host_ip}/api/ollama_ask?apitoken=${Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stream: false,
              model: Settings.apivalues.default_model,
              prompt,
            }),
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
      return "[Failed to connect with ollama]";
    }
  };
