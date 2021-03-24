const fs = require("fs");
const path = require("path");

module.exports = utils => {
	const templates = {
		list: [],
		register(path, urls = [], title, controller) {
			if (!templates.load(path))
				templates.list.push({
					id: path,
					cache: null,
					urls,
					title,
					controller,
				});
		},
		load(template, targetObject = false) {
			return templates.loadMatch(templates.list.filter(t => t.id == template), template, targetObject);
		},
		loadByUrl(url, targetObject = false) {
			return templates.loadMatch(templates.list.filter(t => t.urls.some(u => u == url)), null, targetObject);
		},
		loadMatch(match, template, targetObject = false) {
			if (match.length > 0)
				if (match[0].cache === null || utils.production && utils.appSettings.mvc.templates.cacheOnProduction || !utils.production && utils.appSettings.mvc.templates.cacheOnDevelopment)
					return (() => {
						const target = path.join(utils.public, (template ? template : match[0].id).replace(/[\s\\.-]/g, "/")) + ".html";
						if (fs.existsSync(target))
							match[0].cache = fs.readFileSync(target).toString();
						return targetObject ? match[0] : match[0].cache;
					})();
				else return targetObject ? match[0] : match[0].cache;
			else return null;
		},
		isRedirect(url) {
			const template = templates.loadByUrl(url, true);
			if (template)
				return template.id == "redirect";
			return false;
		}
	};
	if (utils.appSettings.mvc.templates.automaticRegistration) {
		const registerFrom = directory => {
			try {
				const fullPath = path.join(utils.public, directory);
				const entities = fs.readdirSync(fullPath);
				entities.filter(e => e.endsWith(".html"))
				.map(e => (directory + "/" + e.slice(0, -5)).replace(/[\\/]/g, "."))
				.forEach(t => templates.register(t));
				entities.filter(e => !e.endsWith(".html"))
				.forEach(d => registerFrom(directory + "/" + d));
			} catch (error) {
				utils.logger.messages.templateRegistrationError(directory, error);
			}
		};
		registerFrom("templates");
	}
	return templates;
};