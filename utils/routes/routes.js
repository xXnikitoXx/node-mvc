const fs = require("fs");
const { ErrorHandler, HandleError } = require("./../error");
const { Logger } = require("./../logger");
const { Renderer } = require("./../render");
const routes = JSON.parse(fs.readFileSync(__dirname + "/../../data/routes.json"));
const messages = JSON.parse(fs.readFileSync(__dirname + "/../../data/messages.json"));
const routeFiles = fs.readdirSync(__dirname).filter(route => route != "routes.js").map(route => "./" + route.split(".js")[0]);
const customRoutes = JSON.parse(fs.readFileSync(__dirname + "/../../data/customRoutes.json"));

/**
 * Initializes all routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	utils.logger.messages.configuring("/", "GET");
	app.get("/", (req, res) => {
		utils.logger.messages.request("/");
		let user = false;
		if (req.user)
			user = {
				username: req.user.username,
				firstName: req.user.firstName,
				lastName: req.user.lastName,
				joinDate: req.user.joinDate,
			};
		let renderer = new Renderer({
			title: "Website",
			lang: req.lang,
			user: user,
		});
		res.send(renderer.Render(utils.public + "/home.html"));
    });
	
	for (let route in routes) {
		utils.logger.messages.configuring(route, "GET");
		app.get(route, (req, res) => {
			utils.logger.messages.request(route);
			res.sendFile(utils.public + "/" + routes[route]);
		});
	}
	
	for (let message in messages) {
		utils.logger.messages.configuring("/" + message, "GET");
		app.get("/" + message, (req, res) => {
			utils.logger.messages.request("/" + message);
			let errorCode = Number(message);
			throw new ErrorHandler(errorCode, messages[message]);
		});
	}

	for (let route of routeFiles)
		require(route)(app, utils);

	for (let route of customRoutes)
		require(route)(app, utils);

	app.use((err, req, res, next) => { HandleError(err, req, res); });
	app.use((req, res, next) => {
		if (!req.route) {
			let errorCode = 404;
			res.redirect("/" + errorCode);
		}
		next();
	});
};