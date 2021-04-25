const path = require("path");
const watch = require("node-watch");
const { Worker } = require("worker_threads");
const { Server } = require("./../../utils/server");

const messages = {
	devStart: "Starting development server..."
};

module.exports = function() {
	let logger, method, controls;
	if (arguments.length == 2)
		[ logger, controls ] = arguments;
	else
		[ logger, method, controls ] = arguments;
	controls.interrupt();
	logger.text.normal(messages.devStart);
	const dir = path.resolve(__dirname + "/../..");
	let worker = null;
	switch (method) {
		case "dev": {
			const setupEvents = () => {
				worker.on("error", () => {
					refresh();
				});
				worker.on("exit", code => {
					if (code == 0)
						controls.resume();
					else
						refresh();
				});
			};
			const refresh = () => {
				if (worker)
					worker.terminate();
				worker = new Worker("./start/dev.js");
				setupEvents();
			};
			try {
				refresh();
				watch(dir, { recursive: true }, refresh);
			} catch (err) {
				if (err.name == "AbortError")
					return;
				throw err;
			}
			break;
		}
		default: {
			const server = new Server(true, true);
			server.Run().then().catch(error => {
				console.error(error);
				controls.resume();
			});
			break;
		}
	}
};