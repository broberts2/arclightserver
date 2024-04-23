module.exports = (modules: { [key: string]: any }) => async () => {
  try {
    const ChromaClient = new modules.ChromaDB.ChromaClient({
      path: "http://localhost:64536",
    });
    await ChromaClient.deleteCollection({
      name: modules.Integrations.Ollama.Settings.settings.ragdatabase,
    });
    const ChromaCollection = await ChromaClient.createCollection({
      name: modules.Integrations.Ollama.Settings.settings.ragdatabase,
    });
    modules.Chroma = {
      ChromaClient,
      ChromaCollection,
    };
  } catch (e) {
    console.log(e);
    return "[Failed to connect with ollama]";
  }
};
