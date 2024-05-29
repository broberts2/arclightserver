module.exports = (modules: { [key: string]: any }) => async (Settings: any) => {
  try {
    const ChromaClient = new modules.ChromaDB.ChromaClient({
      path: "http://localhost:64536",
    });
    await ChromaClient.deleteCollection({
      name: Settings.settings.ragdatabase,
    });
    modules.Chroma = {
      ChromaClient,
    };
  } catch (e) {
    console.log(e);
  }
};
