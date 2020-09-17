const { Controller } = require("./controller");

/**
 * Initializes register routes.
 * @param {Express.Application} app
 * @param {any} utils
 */
class Register extends Controller {
	DescribeRoutes() {
		this.prefix = "/register";

		this.RegisterGetRoute = "";
		this.RegisterGetMiddleware = [
			this.utils.loginRedirect.forbidden,
			this.utils.csrfProtection,
		];

		this.RegisterPostRoute = "";
		this.RegisterPostMethod = "POST";
		this.RegisterPostMiddleware = [
			this.utils.loginRedirect.forbidden,
			this.utils.csrfProtection,
		];
	}

	async RegisterGet(req) {
		if (!this.utils.db)
			return this.Redirect("/404");
		this.model.csrfToken = req.csrfToken();
		this.model.error = "";
		return this.View();
	}

	async RegisterPost(req) {
		if (!this.utils.db)
			return this.Redirect("/404");
		try {
			await this.utils.accountManager.Register(req.body);
			return this.Finalize(this.Redirect("/login"))
		} catch (err) {
			this.model.csrfToken = req.csrfToken();
			switch(err) {
				case 0:
					this.model.error = "{{form.error.userExists}}";
					break;
				case 1:
					this.model.error = "{{form.error.emailExists}}";
					break;
				case 2:
					this.model.error = "{{form.error.emailInvalid}}";
					break;
				case 3:
					this.model.error = "{{form.error.passwordsMatch}}";
					break;
				case 4:
					this.model.error = "{{form.error.input}}";
					break;
				default:
					this.model.error = "{{form.error.unknown}}";
					break;
			}
			return this.View();
		}
	}
}

module.exports = (app, utils) => new Register(app, utils);