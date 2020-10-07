const { Controller } = require("./controller");

class Home extends Controller {
	DescribeRoutes() {
		this.prefix = "";
		this.IndexRoute = "/";
	}

	async Index() {
		return this.View("home");
	}
}

module.exports = (app, utils) => new Home(app, utils);