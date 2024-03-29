const prodserver = require("./server/index");

const root = "/etc/letsencrypt/live/highmountainlabs.io";

prodserver({
  rootDirectory: __dirname,
  database: "highmountainlabsio",
  publicURI: `https://highmountainlabs.io/arclight`,
  port: 7001,
  cert: {
    key: `${root}/privkey.pem`,
    cert: `${root}/cert.pem`,
    ca: `${root}/chain.pem`,
  },
});
