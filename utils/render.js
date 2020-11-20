const fs = require("fs");
const path = require("path");
const { Iterator } = require("./iterator");

const templateError = "Template not found!";

class Renderer {
	constructor(object, utils, useUrls = false) {
		this.utils = Object.assign({}, utils);
		delete this.utils.db;
		this.model = object;
		if (this.model.user)
			delete this.model.user.password;
		this.useUrls = useUrls;
		this.pattern = {
			openTag: /<(if|for|switch|import|export|request)\b(.*)>/,
		}
	}

	/**
	 * Renders passed file or html.
	 * @function
	 * @param {String} html 
	 * @returns {String}
	 */
	async Render(html, req) {
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
					let ifResult = eval(statement.replace(/model./g, "this.model."));
					html = html.substring(0, index) + (ifResult ? body : "") + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "for":
					if (body.includes("<import")) {
						let innerMatch = body.match(/<(import)\b(.*)>/);
						let innerIndex = innerMatch.index;
						let [ innerTag, innerOperator, innerStatement ] = innerMatch;
						let innerBody = body.substring(innerIndex + innerTag.length);
						let nextInnerClosingTag = Renderer.Pair(innerOperator, innerBody);
						innerBody = innerBody.substring(0, nextInnerClosingTag);
						innerBody = Renderer.RenderImport(this, innerBody, req, innerStatement, this.utils, this.useUrls);
						body = body.substring(0, innerIndex) + innerBody + body.substring(innerIndex + innerTag.length + nextInnerClosingTag + `</${innerOperator}>`.length);
					}
					let template = body;
					body = "";
					function iterateWith(str, values) {
						let result = str;
						for (let v in values) {
							result = result.split("\n");
							for (let l in result)
								if (result[l].match(/<(if|for|switch|case)(.*)>/) != null)
									result[l] = result[l].replace(new RegExp(`([^.])\\b(${v})\\b`, "g"), `$1(${JSON.stringify(values[v])})`);
							let properties = new Iterator(values[v]).ListItems();
							result = result.join("\n").replace(new RegExp(`{{${v}}}`, "g"), values[v]);
							for (let property of properties)
								result = result.replace(new RegExp(`{{${v}.${property.name}}}`, "g"), property.value);
							result = Renderer.Spreads(result, values[v], v);
						}
						return result;
					}
					let variables = statement.split("let ")[1].split(statement.includes(" of ") ? " of " : statement.includes(" in ") ? " in " : "=")[0].replace(/[\[\]]/g, "").replace(" ", "").split(",");
					variables.toValues = function() {
						let result = {};
						let names = this;
						let i = 0;
						for (let arg of arguments)
							result[names[i++]] = arg;
						return result;
					}
					await (eval(`async () => {
						for (${statement.replace(/model/g, "this.model")})
							body += await this.Render(iterateWith(template, variables.toValues(${variables.join(", ")})), req);
					}`))();
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "switch":
					let switchResult = eval(statement.replace(/model./g, "this.model."));
					let cases = body.substring(tag.length).split("<case ")
					.map(c => ({
						statement: c.split(">\r\n")[0],
						body: c
					}))
					.map(c => ({
						result: eval(c.statement.replace(/model./g, "this.model.")),
						body: c.body.split(`${c.statement}>\r\n`)[1].split("</case>")[0],
					}));
					let solved = false;
					for (let c of cases)
						if (c.result == switchResult) {
							solved = true;
							html = html.substring(0, index) + c.body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
							break;
						}
					let defaultMatch = body.match(/<default>[\s\S]*<\/default>/g);
					if (!solved)
						if (defaultMatch != null)
							html = html.substring(0, index) + defaultMatch[0].slice(9, -10) + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
						else
							html = html.substring(0, index) + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "import":
					body = await Renderer.RenderImport(this, body, req, statement, this.utils, this.useUrls);
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "export":
					html = html.substring(0, index) + body + html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					break;
				case "request":
					let [ type, url ] = operator.split().filter(s => s.length > 0);
					type = type.toLowerCase();
					let headers = [];
					if (body.includes("<headers>") && body.includes("</headers>"))
						headers = body.split("<headers>")[1]
							.split("</headers>")[0]
							.replace(/\r\n/g, "\n")
							.split("\n")
							.filter(h => s.length > 0);
					let error = "";
					if (body.includes("<error>") && body.includes("</error>"))
						error = await this.Render(body.split("<error>")[1].split("</error>")[0], req);
					try {
						let hasBody = [ "GET", "HEAD", "DELETE", "OPTIONS" ].includes(type);
						let data = hasBody ? (
								body.includes("<data>") && body.includes("</data>") ?
								JSON.parse(body.split("<data>")[1].split("</data>")[0]) : {}
							) : undefined;
						let response = await utils.httpManager[type](url, hasBody ? data : headers, hasBody ? headers : undefined);
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
							(await this.Render(error.replace(/{{message}}/g, e.toString()), req)) +
							html.substring(index + tag.length + nextClosingTag + `</${operator}>`.length);
					}
				break;
			}
		}
		for (let item of items)
			html = html.replace(new RegExp("{{model." + item.name + "}}", "g"), item.value)
				.replace(new RegExp("~/", "g"), req.hostname);
		html = Renderer.Spreads(html, this.model);
		return html;
	}

	static async RenderImport(instance, body, req, statement, utils, useUrls) {
		let exports = Renderer.Import(statement, utils, useUrls);
		body = await instance.Render(body, req);
		Object.keys(exports)
		.forEach(e => body = body.replace(new RegExp(`<${e}>`, "g"), exports[e]));
		return body;
	}

	static Import(statement, utils, useUrls) {
		let content = utils.templates[useUrls ? "loadByUrl" : "load"](statement.slice(1));
		if (content == null && useUrls)
			content = utils.templates.load(statement.slice(1));
		if (content == null)
			throw new Error(templateError);
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

	static Spreads(html, model, name = "model") {
		let spreads = html.match(new RegExp(`{{(\.\.\.${name}.*)}}`, "g"));
		if (spreads != null) {
			for (let sp of spreads)
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