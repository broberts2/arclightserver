const server = require("./server/index");
//const server = require("@highmountainlabs/arclight-server");

server({
	rootDirectory: __dirname,
	publicURI: `http://localhost:7000`,
	port: 7000,
});
