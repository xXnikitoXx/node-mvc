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
		let controller = this;
		return await new Promise(async (resolve, reject) => {
			this.utils.passport.authenticate("local", (err, user, info) => {
				const errorResponse = async () => {
					return resolve(await controller.View({
						csrfToken: req.csrfToken(),
						error: "{{form.error}}",
					}));
				};
				if (err != null)
					return new Promise(async () => resolve(await errorResponse())).then();
				req.logIn(user, function(err) {
					if (err)
						return new Promise(async () => resolve(await errorResponse())).then();
					let remember = req.body["remember"] != undefined;
					if (remember)
						req.session.cookie.expires = false;
					new Promise(async () => resolve(await controller.Redirect()));
				});
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