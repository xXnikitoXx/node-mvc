const fs = require("fs");
const { Iterator } = require("./iterator");

class Renderer {
	constructor(object) {
		this.model = object;
	}

	/**
	 * Renders passed file or html.
	 * @function
	 * @param {String} html 
	 * @returns {String}
	 */
	Render(html) {
		html = html.toString();
		if (!html.includes("<") && !html.includes(">"))
			if (fs.existsSync(html))
				html = fs.readFileSync(html).toString();
		let items = new Iterator(this.model).ListItems();
		if (html.includes("<if ")) {
			html.match(/<if (.*)>([^]*?)<\/if>/gm)
			.map(cs => ({
				statement: () => cs.match(/<if ([^].*)>/)[1].replace("model", "this.model"),
				body: () => cs.match(/<if .*>([^]*?)<\/if>/)[1],
				html: () => cs,
			}))
			.map(cso => html = html.replace(cso.html(), eval(cso.statement()) ? cso.body() : ""));
		}
		for (let item of items)
			html = html.replace("{{model." + item.name + "}}", item.value);
		return html;
	}
}

module.exports = { Renderer };