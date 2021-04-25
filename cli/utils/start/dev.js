const path = require("path");
const { ESLint } = require("eslint");
const { Server } = require("./../../utils/server");

const eslint = new ESLint();
const server = new Server(true, false);
const dir = path.resolve(__dirname + "/../../..");

eslint.lintFiles(dir)
.then(results =>
	eslint.loadFormatter("stylish")
	.then(formatter => {
		console.log(formatter.format(results));
		server.Run().then().catch(console.error);
	})
).catch(console.error);