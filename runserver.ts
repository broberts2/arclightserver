const server = require("./server/index");

server({
  rootDirectory: __dirname,
  database: "highmountainlabsio",
  publicURI: `http://localhost:7001`,
  port: 7001,
});
