const languages = [ "en", "bg", "de", "fr", "it", "es", "tr", "ru", "ja", "zh", "hi", "bn" ];

/**
 * Initializes language middleware.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
	if (!utils.db)
		return;
	app.use((req, res, next) => {
		if (!req.session.lang || !languages.some(l => l == req.session.lang)) {
			req.session.lang = "en";
			req.lang = req.session.lang;
		} else req.lang = req.session.lang;
		next();
	});
};