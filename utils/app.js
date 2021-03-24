
/**
 * Initializes all routes.
 * @function
 * @param {Express.Application} instance
 */
class App {
	constructor(instance) {
		this.instance = instance;
	}

	get utils() { return this._utils; }
	set utils(value) {
		this._utils = value;
		this.updateMethods();
	}

	updateMethods() {
		for (const method of App.methods)
			this[method] = function() {
				let skip = 1;
				const url = arguments[0];
				let title = undefined;
				let controller = undefined;
				if (typeof arguments[1] == "string") {
					title = arguments[1];
					skip++;
				}
				let template;
				template = (url.startsWith("/") ? url.slice(1) : url).replace(/\//g, ".");
				if (template.length == 0)
					template = "home";
				if (typeof arguments[2] == "boolean") {
					if (!arguments[2])
						template = "redirect";
					skip++;
				} else if (typeof arguments[2] == "string") {
					controller = arguments[2];
					skip++;
					if (typeof arguments[3] == "boolean") {
						if (!arguments[3])
							template = "redirect";
						skip++;
					}
				}
				if (method == "get")
					this.utils.templates.register(template, [ url ], title, controller);
				this.utils.logger.messages.configuring(url, method.toUpperCase());
				const args = [ url, (req, res, next) => { this.utils.logger.messages.request(url); next(); } ].concat([...arguments].slice(skip));
				this.instance[method].apply(this.instance, args);
			};
	}

	use() {
		this.instance.use.apply(this.instance, arguments);
	}

	static get methods() { return [ "checkout", "copy", "delete", "get", "head", "lock", "merge", "mkactivity", "mkcol", "move", "m-search", "notify", "options", "patch", "post", "purge", "put", "report", "search", "subscribe", "trace", "unlock", "unsubscribe", ]; }
}

module.exports = { App };