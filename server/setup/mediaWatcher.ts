module.exports = (modules: any, handleFile: any) => (dir: string) => {
  modules.chokidar.watch(dir).on("add", async (path: any, stats: any) => {
    if (!stats) return;
    // handleFile("add", path);
  });
  modules.chokidar.watch(dir).on("unlink", async (path: any, stats: any) => {
    handleFile("unlink", path);
  });
};
