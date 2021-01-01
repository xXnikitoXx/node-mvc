const fs = require("fs");
const path = require("path");
const { Logger } = require("./../utils/logger");
const logger = new Logger();

let modules = [
	...fs.readdirSync(__dirname + "/builder").map(file => "./builder/" + file),
	...fs.readdirSync(__dirname + "/utils").map(file => "./utils/" + file),
].filter(file => file.toString().endsWith(".js"))
.map(file => file.toString().split(".js")[0])
.reduce((result, item) => {
	result[item.split("/")[2]] = require(item);
	return result;
}, {});

modules.welcome(logger);

let cmd = logger.input.normal("");

while (cmd.toLowerCase().trim() != "exit") {
	cmd = cmd.trim().split(" ");
	args = cmd.slice(1);
	cmd = cmd[0].toLowerCase();
	if (Object.keys(modules).includes(cmd))
		modules[cmd].apply(null, [ logger, ...args ]);
	else
		modules.invalid(logger);
	cmd = logger.input.normal("");
}

modules.exit(logger);