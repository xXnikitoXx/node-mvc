const fs = require("fs");
const path = require("path");

let utils = {
	public: path.join(__dirname + "/../../public"),
	data: path.join(__dirname + "/../../data"),
	middleware: path.join(__dirname + "/../../utils/middleware"),
	routes: path.join(__dirname + "/../../utils/routes"),
	enums: path.join(__dirname + "/../../utils/enums"),
};

utils.templates = {
	list: [],
	register(path, urls = []) {
		this.list.push({
			id: path,
			cache: null,
			urls,
		});
	},
	load(template) {
		let match = this.list.filter(t => t.id == template);
		if (match.length > 0)
			if (match[0].cache == null)
				return (() => {
					let target = path.join(utils.public, template.replace(/[\s\\\.\-]/g, "/")) + ".html";
					if (fs.existsSync(target))
						match[0].cache = fs.readFileSync(target).toString();
					return match[0].cache;
				})();
			else return match[0].cache;
		else return null;
	},
	loadByUrl(url) {
		let match = this.list.filter(t => t.urls.some(u => u == url));
		if (match.length > 0)
			if (match[0].cache == null)
				return (() => {
					let target = path.join(utils.public, match[0].id.replace(/[\s\\\.\-]/g, "/")) + ".html";
					if (fs.existsSync(target))
						match[0].cache = fs.readFileSync(target).toString();
					return match[0].cache;
				})();
			else return match[0].cache;
		else return null;
	}
};

utils.templates.register("templates.test.test");
utils.templates.register("home", [ "/" ]);
utils.templates.register("login", [ "/login" ]);
utils.templates.register("register", [ "/register" ]);

module.exports = utils;