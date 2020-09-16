const { Controller } = require("./controller");

/**
 * §description
 * @param {Express.Application} app
 * @param {any} utils
 */
class §name extends Controller {
	DescribeRoutes() {
		this.prefix = "/§name";
		this.IndexRoute = "";
	}

	Index(req) {
		return this.View();
	}
}

module.exports = (app, utils) => new §name(app, utils);