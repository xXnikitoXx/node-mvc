const fs = require("fs");
const path = require("path");

module.exports = (utils) => {
		return {
		list: [],
		register(path, urls = []) {
			if (!this.load(path))
			this.list.push({
				id: path,
				cache: null,
				urls,
			});
		},
		load(template, targetObject = false) {
			let match = this.list.filter(t => t.id == template);
			if (match.length > 0)
				if (match[0].cache == null)
					return (() => {
						let target = path.join(utils.public, template.replace(/[\s\\\.\-]/g, "/")) + ".html";
						if (fs.existsSync(target))
							match[0].cache = fs.readFileSync(target).toString();
						return targetObject ? match[0] : match[0].cache;
					})();
				else return targetObject ? match[0] : match[0].cache;
			else return null;
		},
		loadByUrl(url, targetObject = false) {
			let match = this.list.filter(t => t.urls.some(u => u == url));
			if (match.length > 0)
				if (match[0].cache == null)
					return (() => {
						let target = path.join(utils.public, match[0].id.replace(/[\s\\\.\-]/g, "/")) + ".html";
						if (fs.existsSync(target))
							match[0].cache = fs.readFileSync(target).toString();
						return targetObject ? match[0] : match[0].cache;
					})();
				else return targetObject ? match[0] : match[0].cache;
			else return null;
		},
		isRedirect(url) {
			let template = this.loadByUrl(url, true);
			if (template)
				return template.id == "redirect";
			return false;
		}
	};
};