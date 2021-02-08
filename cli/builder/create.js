const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");
const directory = `${__dirname}/../..`;
const data = path.join(`${directory}/data`);
const controllers = path.join(`${directory}/utils/routes`);
const views = path.join(`${directory}/public`);
const services = path.join(`${directory}/utils/services`);

let type, name, description, template, target;

module.exports = function() {
	const controller = () => {
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
	};

	const service = () => {
		[ logger, type, name, description ] = arguments;
		name = name.replace(/\s/g, "_");
		name = name[0].toLowerCase() + name.slice(1);
		Name = name[0].toUpperCase() + name.slice(1);
		let model = null;
		let modelExists = false;
		let plural, Plural, singular, Singular;
		let props = [];
		let methods = [];
		if (arguments.length > 4) {
			model = arguments[4];
			for (let i = 5; i < arguments.length; i++)
				props.push(arguments[i]);
		}
		if (model != null) {
			plural = model[0].toLowerCase() + model.slice(1);
			Plural = model[0].toUpperCase() + model.slice(1);
			singular = pluralize.singular(model);
			singular = singular[0].toLowerCase() + singular.slice(1);
			Singular = singular[0].toUpperCase() + singular.slice(1);
			if (pluralize.isSingular(plural))
				[ plural, Plural, singular, Singular ] = [ singular, Singular, plural, Plural ];
			console.log(plural, Plural, singular, Singular);
			let collections = JSON.parse(fs.readFileSync(data + "/dbsettings.json")).mongo.collections;
			if (collections[plural]) {
				let description = collections[plural].model;
				let pre = __dirname + "/templates/service.";
				let suf = ".template.js";
				methods.push(fs.readFileSync(`${pre}all${suf}`).toString());
				methods.push(fs.readFileSync(`${pre}find${suf}`).toString());
				methods.push(fs.readFileSync(`${pre}write.object${suf}`).toString());
				methods.push(fs.readFileSync(`${pre}remove${suf}`).toString());
				let writeProperty = fs.readFileSync(`${pre}write.property${suf}`).toString();
				for (let prop of props)
					if (description[prop]) {
						Prop = prop[0].toUpperCase() + prop.slice(1);
						let method = writeProperty
							.replace(/§prop/g, prop)
							.replace(/§Prop/g, Prop);
						methods.push(method);
					}
			}
		}
		template = fs.readFileSync(`${__dirname}/templates/${type}.template.js`).toString();
		template = template
			.replace(/§methods/g, methods.join("\n\n"))
			.replace(/§singular/g, singular)
			.replace(/§Singular/g, Singular)
			.replace(/§plural/g, plural)
			.replace(/§Plural/g, Plural)
			.replace(/§name/g, name)
			.replace(/§Name/g, Name)
			.replace(/§description/g, description);
		target = path.join(services, name + ".js");
		if (fs.existsSync(target))
			return logger.messages.builderError(`\tThis ${type} already exists!`);
		try {
			fs.writeFileSync(target, template);
			logger.messages.builderSuccess(`Service "${name}" created successfully.`);
		} catch(e) { logger.messages.builderError("\n" + e); }
		/**
		 * §methods
		 */
	};

	const view = () => {
		[ logger, type, name ] = arguments;
		template = fs.readFileSync(`${__dirname}/templates/${type}.template.html`).toString();
		let Name = name.replace(/\s/g, "_");
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
	};

	let logger = arguments[0];
	switch (arguments[1].toLowerCase()) {
		case "controller":
			controller();
			break;
		case "c":
			arguments[1] = "controller";
			controller();
			break;
		case "service":
			service();
			break;
		case "s":
			arguments[1] = "service";
			service();
			break;
		case "view":
			view();
			break;
		case "v":
			arguments[1] = "view";
			view();
			break;
		default:
			return logger.messages.builderError("\tInvalid type!");
	}
};