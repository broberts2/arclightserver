module.exports =
  (modules: { [key: string]: any }) => async (prompt: string) => {
    try {
      const queryEmbeddings = await modules.Integrations.Ollama.embeddings(
        prompt
      );
      return await modules.Chroma.ChromaCollection.query({
        queryEmbeddings: [queryEmbeddings],
        nResults: 15,
      }).then((res: any) => res.documents[0].join("\n\n"));
    } catch (e) {
      return "[Failed to connect with ollama]";
    }
  };
