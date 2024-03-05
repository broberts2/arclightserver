module.exports =
  (modules: { [key: string]: any }) =>
  async (Settings: any, prompt: string) => {
    try {
      const res = await modules
        .fetch(
          Settings.settings.model_host
            ? `http://127.0.0.1:11434/api/embeddings`
            : `${Settings.apivalues.host_ip}/api/ollama_embeddings?apitoken=${Settings.apivalues.api_key}`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stream: false,
              model: "nomic-embed-text",
              prompt,
            }),
          }
        )
        .then((res: any) => res.json());
      return res;
    } catch (e) {
      return "[Failed to connect with ollama]";
    }
  };
