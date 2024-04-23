module.exports =
  (modules: { [key: string]: any }) =>
  async (msg: {
    redirect?: boolean;
    prompt: string;
    id?: string;
    context?: Array<{
      role: string;
      content: string;
    }>;
  }) => {
    try {
      const redir = msg.redirect;
      delete msg.redirect;
      const res = await modules
        .fetch(
          modules.Integrations.Ollama.Settings.settings.model_host && !redir
            ? `http://127.0.0.1:11434/api/chat`
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
                    messages: msg.context
                      ? msg.context.concat({
                          role: "user",
                          content: msg.prompt,
                        })
                      : undefined,
                  }
                : msg
            ),
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
