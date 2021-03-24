const { Server } = require("./../../utils/server");

module.exports = (logger, method, controls) => {
	controls.interrupt();
	let server = null;
	switch (method) {
		case "dev":
			server = new Server(true, false);
			break;
		default:
			server = new Server(true, true);
			break;
	}
	server.Run().then().catch(error => {
		console.error(error);
		controls.resume();
	});
};