module.exports =
  (modules: { [key: string]: any }) =>
  async (Settings: any, prompt: string) => {
    try {
      const res = await modules
        .fetch(`http://127.0.0.1:11434/api/generate`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stream: false,
            model: "ivy",
            prompt,
          }),
        })
        .then((res: any) => res.json())
        .then((res: any) => {
          res.response = res?.response ? res.response.trim() : "";
          return res;
        });
      return res;
    } catch (e) {
      return "[Failed to connect with ollama]";
    }
  };
