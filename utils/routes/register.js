const { Renderer } = require("./../render");

/**
 * Initializes registration routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	utils.logger.messages.configuring("/register", "GET");
	utils.templates.register("register", [ "/register" ]);
	app.get("/register", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res) => {
		if (!utils.db) {
			res.redirect("/404");
			return;
		}
		utils.logger.messages.request("/register");
		let renderer = new Renderer({
			title: "Register",
			lang: req.lang,
			csrfToken: req.csrfToken(),
			error: "",
		}, utils);
		res.send(renderer.Render(utils.public + "/register.html"))
	});

	utils.logger.messages.configuring("/register", "POST");
	app.post("/register", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res) => {
		if (!utils.db) {
			res.redirect("/404");
			return;
		}
		utils.logger.messages.request("/register");
		utils.accountManager.Register(req.body).then(data => {
			res.redirect("/login");
		}).catch(err => {
			let obj = {
				title: "Register",
				lang: req.lang,
				csrfToken: req.csrfToken(),
			};
			let renderer = new Renderer(obj, utils);
			switch(err) {
				case 0:
					obj.error = "{{form.error.userExists}}";
					break;
				case 1:
					obj.error = "{{form.error.emailExists}}";
					break;
				case 2:
					obj.error = "{{form.error.emailInvalid}}";
					break;
				case 3:
					obj.error = "{{form.error.passwordsMatch}}";
					break;
				case 4:
					obj.error = "{{form.error.input}}";
					break;
				default:
					obj.error = "{{form.error.unknown}}";
					break;
			}
			res.send(renderer.Render(utils.public + "/register.html"));
		});
	});
};