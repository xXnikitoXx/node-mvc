const { Controller } = require("./controller");

/**
 * Initializes profile routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
class Profile extends Controller {
	DescribeRoutes() {
		this.Inject("accountManager");

		this.prefix = "/profile";

		this.IndexGetRoute = "";
		this.IndexGetTitle = "Profile";
		this.IndexGetMiddleware = [
			this.utils.loginRedirect.required,
			this.utils.csrfProtection,
		];

		this.IndexPostRoute = "";
		this.IndexPostMethod = "POST";
		this.IndexPostMiddleware = [
			this.utils.loginRedirect.required,
			this.utils.csrfProtection,
		];
	}

	async IndexGet(req) {
		this.model.user = req.user;
		return await this.View();
	}

	async IndexPost(req) {
		this.model.user = req.user;
		let user = {
			...this.model.user,
			...req.body,
		};
		this.model.status = "success";
		try {
			await this.accountManager.UpdateUser(user);
		} catch (err) {
			this.model.status = "error";
		}
		return await this.View();
	}
}

module.exports = (app, utils) => new Profile(app, utils);