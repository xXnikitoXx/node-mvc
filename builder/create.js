const fs = require("fs");
const path = require("path");
const { Logger } = require("./../utils/logger");
const logger = new Logger();
const controllers = path.join(`${__dirname}/../utils/routes`);
const views = path.join(`${__dirname}/../public`);
const requests = path.join(`${__dirname}/requests`);
const services = path.join(`${__dirname}/../utils/services`);
let args = process.argv.slice(2) || null;

const rendererRegex = /((var)|(let)|(const))[\S\s\*]renderer[\S\s\*]=[\S\s\*]new[\S\s]*Renderer[\S\s]*\([\S\s]*.*[\S\s]*\)\;*/g;
let type, name, description, targetRequests, template, target;

switch (args[0].toLowerCase()) {
	case "controller":
		[ type, name, description ] = args;
		targetRequests = args.slice(3);
		template = fs.readFileSync(`${__dirname}/templates/${type}.template.js`).toString();
		template = template
			.replace(/§name/g, name)
			.replace(/§description/g, description);
		target = path.join(controllers, name + ".js");
		if (fs.existsSync(target))
			return logger.messages.builderError(`\tThis ${type} already exists!`);
		try {
			fs.writeFileSync(target, template);
			logger.messages.builderSuccess(`Controller "${name}" created successfully.`);
		} catch(e) { logger.messages.builderError("\n" + e); }
		break;
	case "service":
		[ type, name, description ] = args;
		template = fs.readFileSync(`${__dirname}/templates/${type}.template.js`).toString();
		template = template
			.replace(/§name/g, name.replace(/\s/g, "_"))
			.replace(/§description/g, description);
		target = path.join(services, name + ".js");
		if (fs.existsSync(target))
			return logger.messages.builderError(`\tThis ${type} already exists!`);
		try {
			fs.writeFileSync(target, template);
			logger.messages.builderSuccess(`Service "${name}" created successfully.`);
		} catch(e) { logger.messages.builderError("\n" + e); }
		break;
	case "view":
		[ type, name, controller, request ] = args;
		template = fs.readFileSync(`${__dirname}/templates/${type}.template.html`).toString();
		template = template
			.replace(/§name/g, name.replace(/\s/g, "_"))
			.replace(/§description/g, description);
		target = path.join(views, name + ".html");
		if (fs.existsSync(target))
			return logger.messages.builderError(`\tThis ${type} already exists!`);
		try {
			fs.writeFileSync(target, template);
			logger.messages.builderSuccess(`View "${name}" created successfully.`);
		} catch(e) { logger.messages.builderError("\n" + e); }
		break;
	default:
		return logger.messages.builderError("\tInvalid type!");
}