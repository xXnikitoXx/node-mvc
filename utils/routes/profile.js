const { Renderer } = require("./../render");

/**
 * undefined
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	app.get("/profile", utils.loginRedirect.required, (req, res) => {
		let renderer = new Renderer({
			title: "Profile",
			user: req.user,
		}, utils);
		res.send(renderer.Render(utils.public + "/profile.html"));
	});
};