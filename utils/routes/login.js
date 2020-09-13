const { Renderer } = require("./../render");

/**
 * Initializes login routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	app.get("/login", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res, next) => {
		if (!utils.db) {
			res.redirect("/404");
			return;
		}
		let renderer = new Renderer({
			title: "Login",
			lang: req.lang,
			csrfToken: req.csrfToken(),
			error: ""
		}, utils);
		res.send(renderer.Render(utils.public + "/login.html"));
	});

	app.post("/login", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res, next) => {
		if (!utils.db) {
			res.redirect("/404");
			return;
		}
		utils.passport.authenticate("local", (err, user, info) => {
			const errorResponse = () => {
				let renderer = new Renderer({
					title: "Login",
					lang: req.lang,
					csrfToken: req.csrfToken(),
					error: "{{form.error}}"
				}, utils);
				res.send(renderer.Render(utils.public + "/login.html"));
			};

			if (err != null) {
				errorResponse();
				return;
			}

			req.logIn(user, function(err) {
				if (err) {
					errorResponse();
					return;
				}

				let remember = req.body["remember"] != undefined;
				if (remember)
					req.session.cookie.expires = false;

				res.redirect("/");
			});
		})(req, res, next);
	});
	
	app.get("/logout", utils.loginRedirect.required, (req, res) => {
		if (!utils.db) {
			res.redirect("/404");
			return;
		}
		req.logout();
		res.redirect("/");
	});
};