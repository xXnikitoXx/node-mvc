const fs = require("fs");
const { ErrorHandler, HandleError } = require("./../error");
const { Renderer } = require("./../render");
const routes = JSON.parse(fs.readFileSync(__main + "/data/routes.json"));
const messages = JSON.parse(fs.readFileSync(__main + "/data/messages.json"));
const routeFiles = fs.readdirSync(__main + "/utils/routes")
	.filter(route => route != "routes.js" && route != "controller.js")
	.map(route => __main + "/utils/routes/" + route);
const customRoutes = JSON.parse(fs.readFileSync(__main + "/data/customRoutes.json"));

/**
 * Initializes all routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	for (const route in routes) {
		utils.logger.messages.configuring(route, "GET");
		utils.templates.register(routes[route], [ route ]);
		app.instance.get(route, (req, res) => {
			utils.logger.messages.request(route);
			const renderer = new Renderer({
				title: route[1].toUpperCase() + route.slice(2),
				user: req.user,
			}, utils);
			res.send(renderer.Render(utils.public + "/" + routes[route], req));
		});
	}

	utils.templates.register("error", Object.keys(messages).map(k => "/" + k), "Error");
	for (const message in messages) {
		utils.logger.messages.configuring("/" + message, "GET");
		app.instance.get("/" + message, () => {
			utils.logger.messages.request("/" + message);
			const errorCode = Number(message);
			throw new ErrorHandler(errorCode, messages[message]);
		});
	}

	for (const route of routeFiles)
		require(route)(app, utils);

	for (const route of customRoutes)
		require(route)(app, utils);

	app.instance.use((err, req, res, next) => (async () => await HandleError(err, req, res, next, utils))());
	app.instance.use((req, res, next) => {
		if (!req.route)
			res.redirect("/404");
		next();
	});
};