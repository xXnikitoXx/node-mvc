const fs = require("fs");
const path = require("path");
const { Iterator } = require("./iterator");

const templateError = "Template not found!";
const layoutError = "Layout not found!";
const layoutStructError = "Invalid layout!";

class Renderer {
	constructor(object, utils, useUrls = false) {
		this.utils = Object.assign({}, utils);
		delete this.utils.db;
		this.model = object;
		if (this.model.user)
			delete this.model.user.password;
		this.useUrls = useUrls;
		this.pattern = {
			openTag: /<(if|for|switch|import|export|request|layout|view)\b(.*)>/,
		};
	}

	/**
	 * Renders passed file or html.
	 * @function
	 * @param {String} html 
	 * @returns {String}
	 */
	async Render(html, req, renderExports = true) {
		html = html.toString();
		if (!html.includes("<") && !html.includes(">"))
			if (fs.existsSync(html))
				html = fs.readFileSync(html).toString();
				const items = new Iterator(this.model).ListItems();
		while (html.match(this.pattern.openTag) !== null) {
			const match = html.match(this.pattern.openTag);
			const index = match.index;
			const [ tag, operator ] = match;
			let [ , , statement ] = match;
			let body = html.substring(index + tag.length);
			const nextClosingTag = Renderer.Pair(operator, body);
			body = body.substring(0, nextClosingTag);
			switch (operator) {
				case "if": {
					const ifResult = eval(statement.replace(/model./g, "this.model."));
					html = html.substring(0, index) + (ifResult ? body : "") + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
				case "for": {
					if (body.includes("<import")) {
						const innerMatch = body.match(/<(import)\b(.*)>/);
						const innerIndex = innerMatch.index;
						const [ innerTag, innerOperator, innerStatement ] = innerMatch;
						let innerBody = body.substring(innerIndex + innerTag.length);
						const nextInnerClosingTag = Renderer.Pair(innerOperator, innerBody);
						innerBody = innerBody.substring(0, nextInnerClosingTag);
						innerBody = Renderer.RenderImport(this, innerBody, req, innerStatement, this.utils, this.useUrls);
						body = body.substring(0, innerIndex) + innerBody + body.substring(innerIndex + innerTag.length + nextInnerClosingTag + `</${innerOperator}>`.length);
					}
					/* eslint-disable no-unused-vars */
					const template = body;
					body = "";
					const iterateWith = (str, values) => {
						let result = str;
						for (const v in values) {
							result = result.split("\n");
							for (const l in result)
								if (result[l].match(/<(if|for|switch|case)(.*)>/) !== null)
									result[l] = result[l].replace(new RegExp(`([^.])\\b(${v})\\b`, "g"), `$1(${JSON.stringify(values[v])})`);
							const properties = new Iterator(values[v]).ListItems();
							result = result.join("\n").replace(new RegExp(`{{${v}}}`, "g"), values[v]);
							for (const property of properties)
								result = result.replace(new RegExp(`{{${v}.${property.name}}}`, "g"), property.value);
							result = Renderer.Spreads(result, values[v], v);
						}
						return result;
					};
					/* eslint-enable no-unused-vars */
					const variables = statement.split("let ")[1].split(statement.includes(" of ") ? " of " : statement.includes(" in ") ? " in " : "=")[0].replace(/[[\]]/g, "").replace(" ", "").split(",");
					variables.toValues = function() {
						const result = {};
						const names = this;
						let i = 0;
						for (const arg of arguments)
							result[names[i++]] = arg;
						return result;
					};
					await eval(`async () => {
						for (${statement.replace(/model/g, "this.model")})
							body += await this.Render(iterateWith(template, variables.toValues(${variables.join(", ")})), req, renderExports);
					}`)();
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
				case "switch": {
					const switchResult = eval(statement.replace(/model./g, "this.model."));
					let cases = body.split("<case ");
					cases.shift();
					cases = cases.map(c => ({
						statement: c.split(">\r\n")[0],
						body: c
					}))
					.map(c => ({
						result: eval(c.statement.replace(/model./g, "this.model.")),
						body: c.body.split(`${c.statement}>\r\n`)[1].split("</case>")[0],
					}));
					let solved = false;
					for (const c of cases)
						if (c.result == switchResult) {
							solved = true;
							html = html.substring(0, index) + c.body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
							break;
						}
						const defaultMatch = body.match(/<default>[\s\S]*<\/default>/g);
					if (!solved)
						if (defaultMatch !== null)
							html = html.substring(0, index) + defaultMatch[0].slice(9, -10) + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
						else
							html = html.substring(0, index) + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
				case "import": {
					for (const item of items)
						statement = statement.replace(new RegExp("{{model." + item.name + "}}", "g"), item.value);
					body = await Renderer.RenderImport(this, body, req, statement, this.utils, this.useUrls, renderExports);
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
				case "export": {
					if (renderExports)
						html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					else
						html = html.substring(0, index) + `<_export ${this.utils.appSettings.mvc.templates.defaultTarget}>\r\n` + body + "\r\n</_export>" + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
				case "request": {
					let [ type, url ] = statement.split(" ").filter(s => s.length > 0);
					type = type.toLowerCase();
					url = url.replace(/~\//g, req.hostname.replace("localhost", "http://localhost") + "/");
					let headers = [];
					if (body.includes("<headers>") && body.includes("</headers>"))
						headers = body.split("<headers>")[1]
							.split("</headers>")[0]
							.replace(/\r\n/g, "\n")
							.split("\n")
							.filter(h => h.length > 0);
					let error = "";
					if (body.includes("<error>") && body.includes("</error>"))
						error = await this.Render(body.split("<error>")[1].split("</error>")[0], req, renderExports);
					try {
						const hasBody = [ "get", "head", "delete", "options" ].includes(type);
						const data = hasBody ?
								body.includes("<data>") && body.includes("</data>") ?
								JSON.parse(body.split("<data>")[1].split("</data>")[0]) : {}
							: undefined;
						const response = await this.utils.httpManager[type](url, hasBody ? data : headers, hasBody ? headers : undefined);
						if (body.includes("<response>") && body.includes("</response>")) {
							body = body.split("<response>")[1].split("</response>")[0];
							body = body.replace(/<status>/g, response.status)
								.replace(/<statusText>/g, response.statusText);
							if (body.includes("<json>"))
								body = body.replace(/<json>/g, await response.json());
							if (body.includes("<text>"))
								body = body.replace(/<text>/g, await response.text());
						}
						html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					} catch (e) {
						html = html.substring(0, index) +
							await this.Render(error.replace(/{{message}}/g, e.toString()), req, renderExports) +
							html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					}
					break;
				}
				case "layout": {
					if (renderExports) {
						const layoutPath = path.join(this.utils.public, statement.replace(/[\s\\.-]/g, "/") + ".html");
						if (!fs.existsSync(layoutPath))
							throw new Error(layoutError);
							const layout = fs.readFileSync(layoutPath).toString();
							const [ start, end ] = layout.split("<view>");
						if (end == undefined)
							throw new Error(layoutStructError);
						html = html.substring(0, index) + start + body + end + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					} else
						html = html.substring(0, index) + `<_layout ${this.utils.appSettings.mvc.templates.defaultTarget}>\r\n` + body + "\r\n</_layout>" + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				}
			}
		}
		for (const item of items)
			html = html.replace(new RegExp("{{model." + item.name + "}}", "g"), item.value)
				.replace(new RegExp("~/", "g"), req.hostname);
		html = Renderer.Spreads(html, this.model);
		return html;
	}

	static async RenderImport(instance, body, req, statement, utils, useUrls, renderExports) {
		const exports = Renderer.Import(statement, utils, useUrls);
		body = await instance.Render(body, req, renderExports);
		Object.keys(exports)
		.forEach(e => body = body.replace(new RegExp(`<${e}>`, "g"), exports[e]));
		return body;
	}

	static Import(statement, utils, useUrls) {
		let content = utils.templates[useUrls ? "loadByUrl" : "load"](statement.slice(1));
		if (content === null && useUrls)
			content = utils.templates.load(statement.slice(1));
		if (content === null)
			throw new Error(templateError);
		const pairs = [];
		const exports = {};
		const total = content.match(/<export .*>/g).length;
		for (let i = 0; i < total; i++)
			pairs.push([ Renderer.NthOccurrence(content, "<export ", i) ]);
		pairs.forEach(p => {
			const name = content.substring(p[0] + "<export ".length).split(">")[0];
			const bodyIndex = p[0] + "<export ".length + name.length + 1;
			p[1] = Renderer.Pair("export", content.substring(bodyIndex));
			const body = content.substring(bodyIndex, p[1] + bodyIndex);
			exports[name] = body;
		});
		return exports;
	}

	static Spreads(html, model, name = "model") {
		const spreads = html.match(new RegExp(`{{(...${name}.*)}}`, "g"));
		if (spreads !== null) {
			for (const sp of spreads)
				try {
					let spreaded = JSON.stringify(eval(sp.replace(new RegExp(`{{...${name}}}`, "g"), "{{...model}}").slice(5, -2)), null, "\t")
					.replace(/\t"([.\w]*)": {/, "get $1() { return {")
					.replace(/\t}/g, "}}");
					spreaded = spreaded.replace(/\t"([.\w]*)": (.*)/g, "get $1() { return $2; },").replace(/,;/g, ";").replace(/\[; },(.*?)}}[\s\S]*\]/gs, "[$1}]}");
					html = html.replace(new RegExp(sp, "g"), spreaded);
				} catch (e) {
					throw new Error(sp.slice(5, -2) + " is not defined!");
				}
		}
		return html;
	}

	static Pair(tag, body) {
		const parts = body.split(`</${tag}>`);
		let openTags = 0;
		let closingTags = 0;
		for (const p of parts) {
			closingTags++;
			const match = p.match(new RegExp(`<${tag}(.*)`, "g"));
			if (match !== null)
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