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

		this.TermsTitle = "Terms of Service";
		this.PrivacyTitle = "Privacy Policy";
		this.ContactTitle = "Contact Us";
	}

	async Terms() {
		return await this.View();
	}

	async Privacy() {
		return await this.View();
	}

	async Contact() {
		return await this.View();
	}
}

module.exports = (app, utils) => new Contact(app, utils);