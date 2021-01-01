const { Server } = require("./../../utils/server");

module.exports = () => {
	let server = new Server(true, false);
	server.Run().then().catch(console.error);
}