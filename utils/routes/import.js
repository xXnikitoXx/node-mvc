const { Renderer } = require("./../render");

/**
 * The HTTP variant of importing HTML modules from templates.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	let logging = utils.appSettings.mvc.templates.dynamicLoaderLogs;
	utils.logger.messages.configuring("/import", "POST");
	app.instance.post("/import", (req, res, next) => {
		if (logging.native && logging.target)
			utils.logger.messages.request("/import -> " + req.body.template);
		else if (logging.native)
			utils.logger.messages.request("/import");
		else if (logging.target)
			utils.logger.messages.request(req.body.template);
		utils.csrfProtection(req, res, () => {
			if (utils.templates.isRedirect(req.body.template)) {
				res.send("redirect " + req.body.template);
			}
			else {
				req.body.template = req.body.template.split("?")[0];
				let template = utils.templates.loadByUrl(req.body.template, true);
				req.body.template = `${template ?
					template.cache.split(`<export ${utils.appSettings.mvc.templates.defaultTarget}>`)[1].split("</export>")[0] :
					`<import ${req.body.template}>\r\n\t<${utils.appSettings.mvc.templates.defaultTarget}>\r\n</import>`}\r\n<script>model = {{...model}};</script>`;
				req.body.model.user = req.user;
				req.body.model.error = "";
				req.body.model.csrfToken = req.csrfToken();
				req.body.model.title = template ? template.title : req.body.model.title;
				let renderer = new Renderer(req.body.model, utils, true);
				req.url = req.body.template;
				let result = "redirect /404";
				new Promise(async (resolve) => resolve(await renderer.Render(req.body.template, req)))
				.then(result => res.send(result))
				.catch(() => res.send(result));
			}
		})
	});
};