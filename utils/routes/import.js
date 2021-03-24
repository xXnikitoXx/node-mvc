const fs = require("fs");

/**
 * The HTTP variant of importing HTML modules from templates.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	const logging = utils.appSettings.mvc.templates.dynamicLoaderLogs;
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
			} else {
				req.body.template = req.body.template.split("?")[0];
				const template = utils.templates.loadByUrl(req.body.template, true);
				if (template) {
					const matchUrls = (x, y) => {
						x = x.toLowerCase().trim();
						y = y.toLowerCase().trim();
						return x == y;
					};
					const controller = utils.controllers[template.controller];
					const methods = Object.values(controller.methods); 
					const method = methods
						.filter(m => matchUrls(req.body.template, m.Route) && m.Method.toUpperCase() == "GET")[0];
					(async resolve => {
						controller.model = { title: method.Title, lang: req.lang || undefined, user: req.user },
						controller._req = req;
						controller._response = undefined;
						controller._redirect = false;
						controller._redirectPath = "/";
						controller._sendStatus = false;
						controller._renderExports = false;
						controller._targetView = controller.utils.public + method.Route + ".html";
						controller._viewExists = fs.existsSync(controller._targetView);
						const result = await method.Callback.apply(controller, [ req, res, next ]);
						resolve(result);
					})(response => {
						if (this._redirect)
							return res.redirect(this._redirectPath || "/");
						if (response == undefined || response === null)
							response = this._response;
						if (typeof response == "number" && !this._sendStatus)
							response = response.toString();
						if (response.includes("<_export"))
							response = response.split(`<_export ${utils.appSettings.mvc.templates.defaultTarget}>`)[1].split("</_export>")[0];
						res[this._sendStatus ? "sendStatus" : "send"]({ model: controller.model, template: response });
					});
				} else
					res.send("redirect /404");
			}
		});
	});
};