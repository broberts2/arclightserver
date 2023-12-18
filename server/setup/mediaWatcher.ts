module.exports = (modules: any) => (dir: string) => {
  const operation = (op: string, _: string) => {
    const filename = _.match(/[ \w-]+?(?=\.)/g);
    if (!filename?.length) return;
    return {
      //@ts-ignore
      filename: filename[0],
      ext: _.split(".")[1],
      op,
    };
  };
  modules.chokidar.watch(dir).on("add", async (path: any, stats: any) => {
    if (!stats) return;
    const op = operation("add", path);
    if (!op) return;
    if (modules.mongoose.isValidObjectId(op.filename)) {
      // const MediaRecord = await modules._models.media.findOne({
      //   _id: op.filename,
      // });
    } else {
      const MediaRecord = await modules._models.media
        .insertMany({
          _system: true,
          _parent: undefined,
          _ext: op.ext,
          name: op.filename,
        })
        .then((res: any) => res[0]);
      if (!MediaRecord) throw new Error("Create Failed.");
      await modules._models.media.updateOne(
        { _id: MediaRecord._id },
        {
          img: `${modules.globals.publicURI}/static/media/${MediaRecord._id}.${op.ext}`,
        }
      );
      modules.fs.renameSync(
        path,
        `${modules.rootDirectory}/media/${MediaRecord._id}.${op.ext}`
      );
    }
  });
  modules.chokidar.watch(dir).on("unlink", async (path: any, stats: any) => {
    const op = operation("unlink", path);
    if (!op) return;
    if (modules.mongoose.isValidObjectId(op.filename)) {
      await modules._models.media.deleteOne({
        _id: op.filename,
      });
    }
  });
};
