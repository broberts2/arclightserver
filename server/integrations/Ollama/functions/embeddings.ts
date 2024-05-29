module.exports =
  (modules: { [key: string]: any }) => async (prompt: string) => {
    try {
      const res = await modules
        .fetch(
          modules.Integrations.Ollama.Settings.settings.model_host
            ? `http://127.0.0.1:11434/api/embeddings`
            : `${modules.Integrations.Ollama.Settings.apivalues.host_ip}/api/ollama_embeddings?apitoken=${modules.Integrations.Ollama.Settings.apivalues.api_key}`,
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
      return res.embedding;
    } catch (e) {
      console.log(e);
      return "[Failed to connect with ollama]";
    }
  };
