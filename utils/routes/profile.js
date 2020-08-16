const { Renderer } = require("./../render");

/**
 * undefined
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	utils.logger.messages.configuring("/profile", "GET");
	utils.templates.register("profile", [ "/profile" ]);
	app.get("/profile", utils.loginRedirect.required, (req, res) => {
		utils.logger.messages.request("/profile");
		let renderer = new Renderer({
			title: "Profile",
			user: req.user,
		}, utils);
		res.send(renderer.Render(utils.public + "/profile.html"));
	});
};