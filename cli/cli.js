global.__main = __dirname.includes("node_modules") ? `${__dirname}/../../../..` : `${__dirname}/../`;
const fs = require("fs");
const { Logger } = require("./../utils/logger");
const logger = new Logger();

const readdir = dir =>
	fs.readdirSync(__dirname + dir).map(file => `.${dir}/${file}`);

const modules = [
	...readdir("/builder"),
	...readdir("/utils"),
].filter(file => file.toString().endsWith(".js"))
.map(file => file.toString().split(".js")[0])
.reduce((result, item) => {
	result[item.split("/")[2]] = require(item);
	return result;
}, {});

modules.welcome(logger);

let cmd = logger.input.normal("");
const controls = {
	interrupted: false,
	nextAction: () => {},
	invoke(cmd, args) {
		this.nextAction = () =>
			modules[cmd].apply(null, [ logger, ...args, this ]);
	},
	interrupt() {
		this.interrupted = true;
	},
	resume() {
		this.interrupted = false;
		input();
	},
};

const input = () => {
	while (cmd.toLowerCase().trim() != "exit") {
		cmd = cmd.trim().split(" ");
		const args = cmd.slice(1);
		cmd = cmd[0].toLowerCase();
		if (Object.keys(modules).includes(cmd)) {
			modules[cmd].apply(null, [ logger, ...args, controls ]);
			if (controls.interrupted)
				break;
		} else
			modules.invalid(logger);
		cmd = logger.input.normal("");
	}
	if (!controls.interrupted)
		modules.exit(logger);
};

input();