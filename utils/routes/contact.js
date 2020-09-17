const { Controller } = require("./controller");

/**
 * Initializes Terms of Use, Privacy Policy and Contact routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
class Contact extends Controller {
	DescribeRoutes() {
		this.prefix = "";
	}

	async Terms() {
		return this.View();
	}

	async Privacy() {
		return this.View();
	}

	async Contact() {
		return this.View();
	}
}

module.exports = (app, utils) => new Contact(app, utils);