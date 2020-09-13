
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
		for (let method of App.methods)
			this[method] = function() {
				let url = arguments[0];
				let template = (url.startsWith("/") ? url.slice(1) : url).replace(/\//g, ".");
				if (method == "get")
					this.utils.templates.register(template, [ url ]);
				this.utils.logger.messages.configuring(url, method.toUpperCase());
				let args = [ url, (req, res, next) => { this.utils.logger.messages.request(url); next(); } ].concat([...arguments].slice(1));
				this.instance[method].apply(this.instance, args);
			}
	}

	use() {
		this.instance.use.apply(this.instance, arguments);
	}

	static get methods() { return [ "checkout", "copy", "delete", "get", "head", "lock", "merge", "mkactivity", "mkcol", "move", "m-search", "notify", "options", "patch", "post", "purge", "put", "report", "search", "subscribe", "trace", "unlock", "unsubscribe", ]; }
}

module.exports = { App };