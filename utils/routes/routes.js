const fs = require("fs");
const csurf = require("csurf");
const { ErrorHandler, HandleError } = require("./../error");
const { Logger } = require("./../logger");
const { Renderer } = require("./../render");
const routes = JSON.parse(fs.readFileSync(__dirname + "/../../data/routes.json"));
const messages = JSON.parse(fs.readFileSync(__dirname + "/../../data/messages.json"));
const routeFiles = fs.readdirSync(__dirname).filter(route => route != "routes.js" && route != "controller.js").map(route => "./" + route.split(".js")[0]);
const customRoutes = JSON.parse(fs.readFileSync(__dirname + "/../../data/customRoutes.json"));

/**
 * Initializes all routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	for (let route in routes) {
		utils.logger.messages.configuring(route, "GET");
		utils.templates.register(routes[route], [ route ]);
		app.instance.get(route, (req, res) => {
			utils.logger.messages.request(route);
			let renderer = new Renderer({
				title: route[1].toUpperCase() + route.slice(2),
				user: req.user,
			}, utils);
			res.send(renderer.Render(utils.public + "/" + routes[route], req));
		});
	}

	utils.templates.register("error", Object.keys(messages).map(k => "/" + k), "Error");
	for (let message in messages) {
		utils.logger.messages.configuring("/" + message, "GET");
		app.instance.get("/" + message, (req, res) => {
			utils.logger.messages.request("/" + message);
			let errorCode = Number(message);
			throw new ErrorHandler(errorCode, messages[message]);
		});
	}

	for (let route of routeFiles)
		require(route)(app, utils);

	for (let route of customRoutes)
		require(route)(app, utils);

	app.instance.use((err, req, res, next) => new Promise(async () => await HandleError(err, req, res, utils)).tnen());
	app.instance.use((req, res, next) => {
		if (!req.route) {
			let errorCode = 404;
			res.redirect("/" + errorCode);
		}
		next();
	});
};