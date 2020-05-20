const { Iterator } = require("./iterator");

class Renderer {
	constructor(object) {
		this.object = object;
	}

	Render(html) {
		html = html.toString();
		let items = new Iterator(this.object).ListItems();
		if (html.includes("<if ")) {
			html.split("<if ")
			.slice(1)
			.map(cs => ({
				statement: cs.split(">\r\n")[0],
				body: cs.split(">\r\n")[1].split("</if>")[0],
				html: "<if " + cs.split("</if>")[0] + "</if>",
			}))
			.map(cso => html = html.replace(cso.html, eval(cso.statement) ? cso.body : ""));
		}
		for (let item of items)
			html = html.replace("{{" + item.name + "}}", item.value);
		return html;
	}
}

module.exports = { Renderer };