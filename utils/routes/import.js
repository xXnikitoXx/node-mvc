const { Renderer } = require("./../render");
const { request } = require("express");

/**
 * The HTTP variant of importing HTML modules from templates.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	app.post("/import", (req, res, next) => {
		utils.csrfProtection(req, res, () => {
			if (utils.templates.isRedirect(req.body.template)) {
				res.send("redirect " + req.body.template);
			}
			else {
				req.body.template = `<import ${req.body.template}>\r\n\t<default>\r\n</import>\r\n<script>model = {{...model}};</script>`;
				req.body.model.user = req.user;
				req.body.model.error = "";
				req.body.model.csrfToken = req.csrfToken();
				let renderer = new Renderer(req.body.model, utils, true);
				req.url = req.body.template;
				res.send(renderer.Render(req.body.template));
			}
		})
	});
};