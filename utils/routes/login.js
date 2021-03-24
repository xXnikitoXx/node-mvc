const { Controller } = require("./controller");

/**
 * Initializes login routes.
 * @param {Express.Application} app
 * @param {any} utils
 */
class Login extends Controller {
	DescribeRoutes() {
		this.prefix = "/login";

		this.LoginGetTitle = "Login";
		this.LoginGetRoute = "";
		this.LoginGetMiddleware = [
			this.utils.loginRedirect.forbidden,
			this.utils.csrfProtection,
		];

		this.LoginPostTitle = "Login";
		this.LoginPostRoute = "";
		this.LoginPostMethod = "POST";
		this.LoginPostMiddleware = [
			this.utils.loginRedirect.forbidden,
			this.utils.csrfProtection,
		];

		this.LogoutRoute = "/logout";
		this.LogoutMiddleware = [ this.utils.loginRedirect.required, ];
	}

	async LoginGet(req) {
		if (!this.utils.db)
			return this.Redirect("/404");
		this.model.csrfToken = req.csrfToken();
		this.model.error = "";
		return await this.View();
	}

	async LoginPost(req, res, next) {
		if (!this.utils.db)
			return await this.Redirect("/404");
		const controller = this;
		const result = async (err, user) => {
			const errorResponse = async () => {
				return await controller.View({
					csrfToken: req.csrfToken(),
					error: "{{form.error}}",
				});
			};

			if (err !== null)
				return errorResponse();

			req.logIn(user, function(err) {
				if (err)
					return errorResponse();
				const remember = req.body["remember"] != undefined;
				if (remember)
					req.session.cookie.expires = false;
				return controller.Redirect();
			});
		};

		return await new Promise(resolve => {
			this.utils.passport.authenticate("local", (err, user) => {
				result(err, user).then(resolve);
			})(req, res, next);
		});
	}

	async Logout(req) {
		if (!this.utils.db)
			return await this.Redirect("/404");
		req.logout();
		return await this.Redirect();
	}
}

module.exports = (app, utils) => new Login(app, utils);