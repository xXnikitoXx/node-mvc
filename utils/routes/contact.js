const { Renderer } = require("./../render");

/**
 * Initializes Terms of Use, Privacy Policy and Contact routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	app.get("/terms", "Terms of Use", (req, res) => {

	});

	app.get("/privacy", "Privacy Policy", (req, res) => {

    });

	app.get("/contact", "Contact Us", (req, res) => {

	});
};