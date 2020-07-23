const fs = require("fs");
const path = require("path");
const { Logger } = require("./../utils/logger");
const logger = new Logger();
const controllers = path.join(`${__dirname}/../utils/routes`);
const views = path.join(`${__dirname}/../public`);
const requests = path.join(`${__dirname}/requests`);
const services = path.join(`${__dirname}/../utils/services`);
let args = process.argv.slice(2) || null;

const getType = (path) => {
	if (path.includes("requests"))
		return "Request";
	if (path.includes("routes"))
		return "Controller";
	if (path.includes("services"))
		return "Service";
	if (path.includes("public"))
		return "View";
}

const types = {
	controller: controllers,
	view: views,
	request: requests,
	service: services,
};

const extentions = {
	controller: ".js",
	view: ".html",
	request: ".json",
	service: ".js",
};

const error = (type) => `\tThis ${type == "any" || type == "all" ? "element" : type} does not exist!`;
const success = (type, name) => `${type[0].toUpperCase() + type.slice(1)} "${name}" removed successfully.`;

const target = (type, name) => type == "any" || type == "all" ? Object.keys(types).map(t => path.join(types[t], name + extentions[t])) : path.join(types[type], name + extentions[type]);

let type, name;

if (args.length == 1)
	[ type, name ] = [ "any", args[0] ];
else if (!Object.keys(types).includes(args[0]))
	[ type, name ] = [ args[0] == "*" ? "all" : "any", args[1] ];
else
	[ type, name ] = args;

let targetPath = target(type, name);
if (Array.isArray(targetPath)) {
	let targets = targetPath.filter(t => fs.existsSync(t));
	let simplified = targets.map(t => ({
		type: getType(t),
		name: name,
		path: t,
	}));
	if (targets.length == 0)
		return logger.messages.builderError(`\tThere aren't any elements with name "${name}"!`);
	if (targets.length == 1) {
		type = getType(targets[0]);
		fs.unlinkSync(targets[0]);
		return logger.messages.builderSuccess(success(type, name));
	}
	if (type == "all") {
		targets.forEach(e => {
			type = getType(e);
			fs.unlinkSync(e);
			logger.messages.builderSuccess(success(type, name));
		});
		return;
	} else {
		let lines = [
			"\tThere are multiple instances with this name but different type:",
			simplified.map(s => `\t\t${s.type} "${s.name}" in "${s.path}"`).join(",\n"),
			`\tPlease enter specific type or * for all!`,
			`\n\tnpm run remove (*|${simplified.map(s => s.type.toLowerCase()).join("|")}) ${name}`,
		];
		logger.messages.builderError(lines.join("\n"));
	}
} else {
	if (!fs.existsSync(targetPath))
		return logger.messages.builderError(error(type));
	fs.unlinkSync(targetPath);
	logger.messages.builderSuccess(success(type, name));
}