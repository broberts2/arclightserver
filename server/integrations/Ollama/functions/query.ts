module.exports =
  (modules: { [key: string]: any }) => async (prompt: string) => {
    try {
      const informedData = await modules.Integrations.Ollama.queryrag(prompt);
      const modelQuery = `${informedData} - Use this information to answer the following question: ${prompt}`;
      return await modules.Integrations.Ollama.generate({
        prompt: modelQuery,
      }).then((res: any) => res.message);
    } catch (e) {
      return "[Failed to connect with ollama]";
    }
  };
