const server = require("./server/index");
//const server = require("@highmountainlabs/arclight-server");

const root = "/etc/letsencrypt/live/<my_domain>";

server({
	rootDirectory: __dirname,
	database: "arclight",
	publicURI: `http://localhost:7001`,
	port: 7001,
	// cert: {
	// 	key: `${root}/privkey.pem`,
	// 	cert: `${root}/cert.pem`,
	// 	ca: `${root}/chain.pem`,
	// },
});
