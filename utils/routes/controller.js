const fs = require("fs");
const path = require("path");
const { Renderer } = require("./../render");

class Controller {
	constructor(app, utils) {
		this._isInitialized = false;
		this._sendStatus = false;
		this.renderer = {};
		this.model = {};
		this.prefix = "";
		this.app = app;
		this.utils = utils;
		this.DescribeRoutes();
		this._init();
		this.constructor.View = this.View;
		this.constructor.JSON = this.JSON;
		this.constructor.Status = this.Status;
	}

	get model() {
		return this.renderer.model;
	}

	set model(value) {
		return this.renderer.model = value;
	}

	get app() {
		if (!this._app)
			return null;
		return this._app;
	}

	set app(value) {
		this._app = value;
		if (this.utils != null)
			this._isInitialized = true;
	}

	get utils() {
		if (!this._utils)
			return null;
		return this._utils;
	}

	set utils(value) {
		this._utils = value;
		this.renderer = new Renderer(this.model, this.utils);
		if (this.app != null)
			this._isInitialized = true;
	}

	_init(app, utils) {
		let blacklist = [ "constructor", "DescribeRoutes" ];
		let whitelist = [ "Route", "Method", "Title", "Middleware", "Callback" ];
		let prototypeDefinitions = Object.entries(Object.getOwnPropertyDescriptors(this.__proto__)).map(e => [ e[0], e[1].value ]);
		let definitions = Object.entries(Object.getOwnPropertyDescriptors(this)).map(e => [ e[0], e[1].value ]);
		let methodDefinitions = prototypeDefinitions.filter(e => e[1] != undefined && !blacklist.includes(e[0]));
		this.methods = {};
		for (let definition of methodDefinitions) {
			this.methods[definition[0]] = {
				Route: this.prefix + "/" + definition[0].replace(/_/g, "/").toLowerCase(),
				Method: "GET",
				Title: definition[0],
				Middleware: [],
				Callback: definition[1],
			}
			for (let property of definitions.filter(d => typeof(d.value) != "function").map(d => d[0])) {
				let suffix = property.slice(definition[0].length);
				if (property.startsWith(definition[0]) && whitelist.includes(suffix))
					this.methods[definition[0]][suffix] = this[property];
				if (suffix == "Route" && this[property].length == 0)
					this.methods[definition[0]].Route = this.prefix;
			}
		}
		for (let description of Object.values(this.methods))
			this.app[description.Method.toLowerCase()].apply(this.app, [
				description.Route,
				description.Title,
				...description.Middleware,
				(req, res) => {
					this.model = { title: description.Title, lang: req.lang || undefined },
					this._sendStatus = false;
					this._targetView = this.utils.public + description.Route + ".html";
					this._viewExists = fs.existsSync(this._targetView);
					let response = description.Callback.apply(this, req);
					if (typeof(response) == "number" && !this._sendStatus)
						response = response.toString();
					res[this._sendStatus ? "sendStatus" : "send"](response);
				},
			]);
	}

	View() {
		let target = "";
		if (arguments.length > 0) {
			if (typeof(arguments[0]) == "object")
				this.model = arguments[0];
			else if (arguments.length > 2) {
				target = arguments[0];
				this.model = arguments[1];
			}
		}
		if (this._viewExists)
			return this.renderer.Render(this._targetView);
		return this.renderer.Render(target);
	}

	JSON() {
		if (arguments.length == 0)
			return this.model;
		else if (arguments.length == 1)
			return arguments[0];
		return [...arguments];
	}

	Status(code) {
		this._sendStatus = true;
		return Number(code);
	}
}

module.exports = { Controller };