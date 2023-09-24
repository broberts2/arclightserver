const server = require("./server/index");
//const server = require("@highmountainlabs/arclight-server");

server({
  rootDirectory: __dirname,
  database: "highmountainlabsio",
  publicURI: `http://highmountainlabs.io:7001`,
  port: 7001,
  // cert: {
  // 	key: `${root}/privkey.pem`,
  // 	cert: `${root}/cert.pem`,
  // 	ca: `${root}/chain.pem`,
  // },
});
