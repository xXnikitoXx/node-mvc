const fs = require("fs");
const path = require("path");
const directory = `${__dirname}/../..`;
const controllers = path.join(`${directory}/utils/routes`);
const views = path.join(`${directory}/public`);
const services = path.join(`${directory}/utils/services`);

const getType = (path) => {
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
	service: services,
};

const extentions = {
	controller: ".js",
	view: ".html",
	service: ".js",
};

const error = (type) => `\tThis ${type == "any" || type == "all" ? "element" : type} does not exist!`;
const success = (type, name) => `${type[0].toUpperCase() + type.slice(1)} "${name}" removed successfully.`;

const target = (type, name) => type == "any" || type == "all" ? Object.keys(types).map(t => path.join(types[t], name + extentions[t])) : path.join(types[type], name + extentions[type]);

let type, name;

module.exports = function() {
	let logger = arguments[0];
	if (arguments.length == 2)
		[ type, name ] = [ "any", arguments[1] ];
	else if (!Object.keys(types).includes(arguments[1]))
		[ type, name ] = [ arguments[1] == "*" ? "all" : "any", arguments[2] ];
	else
		[ , type, name ] = arguments;

	switch (type) {
		case "c":
			type = "controller";
			break;
		case "s":
			type = "service";
			break;
		case "v":
			type = "view";
			break;
	}


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
				`\n\tremove (*|${simplified.map(s => s.type.toLowerCase()).join("|")}) ${name}`,
			];
			logger.messages.builderError(lines.join("\n"));
		}
	} else {
		if (!fs.existsSync(targetPath))
			return logger.messages.builderError(error(type));
		fs.unlinkSync(targetPath);
		logger.messages.builderSuccess(success(type, name));
	}
};