const { Logger } = require("./../logger");
const { Renderer } = require("./../render");

/**
 * Initializes login routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
    utils.logger.messages.configuring("/login", "GET");
    app.get("/login", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res, next) => {
        utils.logger.messages.request("/login");
        let renderer = new Renderer({
            title: "Login",
            lang: req.lang,
            csrfToken: req.csrfToken(),
            error: ""
        });
        res.send(renderer.Render(utils.public + "/login.html"));
    });

    utils.logger.messages.configuring("/login", "POST");
	app.post("/login", utils.loginRedirect.forbidden, utils.csrfProtection, (req, res, next) => {
        utils.logger.messages.request("/login");

        utils.passport.authenticate("local", (err, user, info) => {
            const errorResponse = () => {
                let renderer = new Renderer({
                    title: "Login",
                    lang: req.lang,
                    csrfToken: req.csrfToken(),
                    error: "{{form.error}}"
                });
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
        req.logout();
        res.redirect("/");
    });
}