module.exports =
  (modules: { [key: string]: any }) =>
  async (msg: {
    prompt: string;
    id?: string;
    context?: string;
    redirect?: boolean;
  }) => {
    try {
      const redir = msg.redirect;
      delete msg.redirect;
      const res = await modules
        .fetch(
          modules.Integrations.Ollama.Settings.settings.model_host && !redir
            ? `http://127.0.0.1:11434/api/generate`
            : `${modules.Integrations.Ollama.Settings.apivalues.host_ip}/api/ollama_ask?apitoken=${modules.Integrations.Ollama.Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(
              modules.Integrations.Ollama.Settings.settings.model_host && !redir
                ? {
                    stream: false,
                    model:
                      modules.Integrations.Ollama.Settings.apivalues
                        .default_model,
                    prompt: msg.prompt,
                    context: msg.context,
                  }
                : msg
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
      return "[Failed to connect with ollama]";
    }
  };
