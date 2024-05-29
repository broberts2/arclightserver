module.exports =
  (modules: { [key: string]: any }) => async (prompt: string) => {
    try {
      const queryEmbeddings = await modules.Integrations.Ollama.embeddings(
        prompt
      );
      const ChromaCollection =
        await modules.Chroma.ChromaClient.getOrCreateCollection({
          name: modules.Integrations.Ollama.Settings.settings.ragdatabase,
        });
      return await ChromaCollection.query({
        queryEmbeddings: [queryEmbeddings],
        nResults: 15,
      }).then((res: any) => res.documents[0].join("\n\n"));
    } catch (e) {
      console.log(e);
      return "[Failed to connect with ollama]";
    }
  };
