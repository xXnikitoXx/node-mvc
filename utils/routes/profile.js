const { Renderer } = require("./../render");

/**
 * undefined
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	utils.logger.messages.configuring("/profile", "GET");
	app.get("/profile", utils.loginRedirect.required, (req, res) => {
		utils.logger.messages.request("/profile");
		let renderer = new Renderer({
			title: "Profile",
			user: req.user,
		});
		res.send(renderer.Render(utils.public + "/profile.html"));
	});
};