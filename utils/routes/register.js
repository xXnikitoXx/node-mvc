const { Logger } = require("./../logger");
const { Renderer } = require("./../render");
const { AccountManager } = require("./../services/accountManager");

/**
 * Initializes registration routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	if (!utils.db)
		return;

	let accountManager = new AccountManager(utils);

	utils.logger.messages.configuring("/register", "GET");
	app.get("/register", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res) => {
		utils.logger.messages.request("/register");
		let renderer = new Renderer({
			title: "Register",
			lang: req.lang,
			csrfToken: req.csrfToken(),
			error: "",
		});
		res.send(renderer.Render(utils.public + "/register.html"));
	});

	utils.logger.messages.configuring("/register", "POST");
	app.post("/register", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res) => {
		utils.logger.messages.request("/register");
		accountManager.Register(req.body).then(data => {
			res.redirect("/login");
		}).catch(err => {
			let obj = {
				title: "Register",
				lang: req.lang,
				csrfToken: req.csrfToken(),
			};
			let renderer = new Renderer(obj);
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
}