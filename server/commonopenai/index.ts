const _OpenAIAPI: { [key: string]: any } = {};
require("fs")
  .readdirSync(__dirname)
  .forEach((file: any) =>
    !file.includes("index") && file.charAt(0) !== "_"
      ? (_OpenAIAPI[file.split(".")[0]] = require(`./${file}`))
      : null
  );
module.exports = (D: { [key: string]: any }) => {
  D.mnemonics = {};
  Object.keys(_OpenAIAPI).map(
    (k: string) => (_OpenAIAPI[k] = _OpenAIAPI[k](D)(_OpenAIAPI))
  );
  return _OpenAIAPI;
};
