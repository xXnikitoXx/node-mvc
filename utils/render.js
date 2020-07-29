const fs = require("fs");
const path = require("path");
const { Iterator } = require("./iterator");

const templateError = "Template not found!";

class Renderer {
	constructor(object) {
		this.model = object;
		this.pattern = {
			openTag: /<(if|for|switch|import|export)\b(.*)>/,
		}
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
		while (html.match(this.pattern.openTag) != null) {
			let match = html.match(this.pattern.openTag);
			let index = match.index;
			let [ tag, operator, statement ] = match;
			let body = html.substring(index + tag.length);
			let nextClosingTag = Renderer.Pair(operator, body);
			body = body.substring(0, nextClosingTag);
			switch (operator) {
				case "if":
					let result = eval(statement.replace("model.", "this.model."));
					html = html.substring(0, index) + (result ? body : "") + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "for":
					let template = body;
					body = "";
					function iterateWith(str, values) {
						let result = str;
						for (let v in values) {
							result = result.split("\n");
							for (let l in result)
								if (result[l].match(/<(if|for|switch|case)(.*)>/) != null)
									result[l] = result[l].replace(new RegExp(`\\b(${v})\\b`, "g"), values[v]);
							result = result.join("\n").replace(new RegExp(`{{${v}}}`, "g"), values[v]);
						}
						return result;
					}
					let variables = statement.split("let ")[1].split("=")[0].replace(/[\[\]]/g, "").replace(" ", "").split(",");
					variables.toValues = function() {
						let result = {};
						let names = this;
						let i = 0;
						for (let arg of arguments)
							result[names[i++]] = arg;
						return result;
					}
					eval(`for (${statement.replace("model", "this.model")}) body += this.Render(iterateWith(template, variables.toValues(${variables.join(", ")})));`);
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "switch":

					break;
				case "import":
					let exports = Renderer.Import(statement);
					Object.keys(exports)
					.forEach(e => body = body.replace(new RegExp(`<${e}>`, "g"), exports[e]));
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "export":
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
					break;
			}
		}
		for (let item of items)
			html = html.replace(new RegExp("{{model." + item.name + "}}", "g"), item.value);
		return html;
	}

	static Import(statement) {
		let target = path.join(__dirname + "/../public", statement.replace(/[\s\\\.\-]/g, "/")) + ".html";
		if (!fs.existsSync(target))
			throw new Error(templateError);
		let content = fs.readFileSync(target).toString();
		let pairs = [];
		let exports = {};
		let total = content.match(/<export .*>/g).length;
		for (let i = 0; i < total; i++)
			pairs.push([ Renderer.NthOccurrence(content, "<export ", i) ]);
		pairs.forEach(p => {
			let name = content.substring(p[0] + "<export ".length).split(">")[0];
			let bodyIndex = p[0] + "<export ".length + name.length + 1;
			p[1] = Renderer.Pair("export", content.substring(bodyIndex));
			let body = content.substring(bodyIndex, p[1] + bodyIndex);
			exports[name] = body;
		});
		return exports;
	}

	static Pair(tag, body) {
		let parts = body.split(`</${tag}>`);
		let openTags = 0;
		let closingTags = 0;
		for (let p of parts) {
			closingTags++;
			let match = p.match(new RegExp(`<${tag}(.*)`, "g"));
			if (match != null)
				openTags += match.length;
			else {
				if (closingTags > openTags)
					break;
			}
		}
		return Renderer.NthOccurrence(body, `</${tag}>`, closingTags);
	}

	static NthOccurrence(str, sub, n = 0) {
		let times = 0;
		let index = null;
		if (n == 0)
			return str.indexOf(sub);
		while (times < n && index != -1) {
			index = str.indexOf(sub, index + sub.length);
			times++;
		}
		return index || str.indexOf(sub);
	}
}

module.exports = { Renderer };