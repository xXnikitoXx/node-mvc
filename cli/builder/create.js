const fs = require("fs");
const path = require("path");
const directory = `${__dirname}/../..`;
const controllers = path.join(`${directory}/utils/routes`);
const views = path.join(`${directory}/public`);
const services = path.join(`${directory}/utils/services`);

let type, name, description, template, target;

module.exports = function() {
	let logger = arguments[0];
	switch (arguments[1].toLowerCase()) {
		case "controller":
			[ logger, type, name, description ] = arguments;
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
			[ logger, type, name, description ] = arguments;
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
			[ logger, type, name, controller ] = arguments;
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
};