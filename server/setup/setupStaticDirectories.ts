module.exports = (rootDirectory: string, fs: any) => {
  ["media", "scripts", "forms"].map((s: string) =>
    !fs.existsSync(`${rootDirectory}/${s}`)
      ? fs.mkdirSync(`${rootDirectory}/${s}`)
      : null
  );
  ["templates", "documents"].map((s: string) =>
    !fs.existsSync(`${rootDirectory}/forms/${s}`)
      ? fs.mkdirSync(`${rootDirectory}/forms/${s}`)
      : null
  );
  ["create", "delete", "get", "update"].map((__: string) =>
    ["before", "after"].map((_: string) =>
      !fs.existsSync(`${rootDirectory}/scripts/${_}-${__}`)
        ? fs.mkdirSync(`${rootDirectory}/scripts/${_}-${__}`)
        : null
    )
  );
  if (!fs.existsSync(`${rootDirectory}/scripts/custom-call`))
    fs.mkdirSync(`${rootDirectory}/scripts/custom-call`);
  if (!fs.existsSync(`${rootDirectory}/scripts/endpoint`))
    fs.mkdirSync(`${rootDirectory}/scripts/endpoint`);
  if (!fs.existsSync(`${rootDirectory}/scripts/universal`))
    fs.mkdirSync(`${rootDirectory}/scripts/universal`);
};
