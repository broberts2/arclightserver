module.exports =
  (modules: { [key: string]: any }) =>
  async (obj: { data: Array<string> | string; prompt: string }) => {
    try {
      obj.data = modules.Integrations.Ollama.chunker(obj.data, 7, 2);
      const ChromaCollection =
        await modules.Chroma.ChromaClient.getOrCreateCollection({
          name: modules.Integrations.Ollama.Settings.settings.ragdatabase,
        });
      if (Array.isArray(obj.data)) {
        const embeddings: Array<number> = [];
        await Promise.all(
          obj.data.map(async (s: string) => {
            const res = await modules.Integrations.Ollama.embeddings(s);
            embeddings.push(res);
          })
        );
        const __: any = (() => {
          const _: any = {
            ids: [],
            metadatas: [],
          };
          embeddings.map((e, i) => {
            _.ids.push(`${obj.prompt}___${i}`);
            _.metadatas.push({ source: obj.prompt });
          });
          return _;
        })();
        await ChromaCollection.upsert({
          ids: __.ids,
          embeddings,
          metadatas: __.metadatas,
          documents: obj.data,
        });
        return embeddings;
      } else {
        const embeddings = await modules.Integrations.Ollama.embeddings(
          obj.data
        );
        await ChromaCollection.upsert({
          ids: `${obj.prompt}___0`,
          embeddings,
          metadatas: { source: obj.prompt },
          documents: obj.data,
        });
        return embeddings;
      }
    } catch (e) {
      console.log(e);
      return "[Failed to connect with ollama]";
    }
  };
