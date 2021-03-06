const fs = require("fs");
const path = require("path");
const commands = require("./../commands.js");

const title = `\tTech Lab MVC CLI Commands`;

module.exports = (logger, target) => {
	target = commands.filter(cmd => cmd.cmd == target)[0];
	if (target == undefined)
		return logger.listCommands(title, commands);
	logger.commandUsage(target);
};