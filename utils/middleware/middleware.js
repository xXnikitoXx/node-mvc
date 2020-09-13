const fs = require("fs");
const { ObjectId } = require("mongodb");
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const passport = require("passport");
const loginRedirect = require("./../authentication/loginRedirect");
const middlewareFiles = fs.readdirSync(__dirname).filter(route => route != "middleware.js").map(route => "./" + route.split(".js")[0]);
let csrfProtection = csrf({ cookie: true });

/**
 * @function
 * @param {Express.Application} app
 * @returns {Object}
 */
module.exports = (app, utils) => {
	utils.passport = passport;
	utils.loginRedirect = loginRedirect;
	utils.csrfProtection = csrfProtection;
	app.use(express.static(__dirname + "/../../public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json({ type: [ "application/json", "text/plain"] }));
	app.use(cookieParser());
	app.use(helmet());
	app.use((req, res, next) => {
		let features = [
			// "accelerometer 'none'",
			// "ambient-light-sensor 'none'",
			// "autoplay 'none'",
			// "battery 'none'",
			// "camera 'none'",
			// "display-capture 'none'",
			// "document-domain 'none'",
			// "encrypted-media 'none'",
			// "execution-while-not-rendered 'none'",
			// "execution-while-out-of-viewport 'none'",
			"fullscreen '*'",
			// "geolocation 'none'",
			// "gyroscope 'none'",
			// "layout-animations 'none'",
			// "legacy-image-formats 'none'",
			// "magnetometer 'none'",
			// "midi 'none'",
			// "navigation-override 'none'",
			// "oversized-images 'none'",
			// "payment 'none'",
			// "picture-in-picture 'none'",
			// "publickey-credentials-get 'none'",
			// "sync-xhr 'none'",
			// "usb 'none'",
			// "vr 'none'",
			// "wake-lock 'none'",
			// "screen-wake-lock 'none'",
			// "web-share 'none'",
			// "xr-spatial-tracking 'none'",
		];
		res.setHeader("Feature-Policy", features.join("; "));
		let csp = {
			"default": [
				`'self'`,
				`'unsafe-eval'`,
				`'unsafe-inline'`,
				`techlab.ddns.net`,
				`*.google.com`,
				`*.cloudflare.com`,
				`*.facebook.com`,
				`*.fontawesome.com`,
			],
			"img": [
				`*`,
				`'self'`,
				`data:`
			],
			"media": [
				`*`
			],
			"script": [
				`'self'`,
				`'unsafe-eval'`,
				`'unsafe-inline'`,
				`techlab.ddns.net`,
				`*.google.com`,
				`*.cloudflare.com`,
				`*.facebook.com`,
				`*.fontawesome.com`,
			],
		};
		res.setHeader("Content-Security-Policy", Object.keys(csp).map(src => `${src}-src ${csp[src].join(" ")}`).join("; "));
		res.setHeader("Referrer-Policy", "strict-origin");
		res.setHeader("Server", "Tech Lab");
		res.setHeader("X-Powered-By", "Tech Lab");
		next();
	});
	if (utils.db) {
		app.use(session({
			secret: process.env.SESSION_SECRET || "eksdi",
			save: true,
			resave: false,
			saveUninitialized: false,
			store: new MongoStore({
				client: utils.db.Client,
				dbName: utils.db.Name,
			}),
			cookie: { secure: false },
		}));
		app.use(passport.initialize());
		app.use(passport.session());
	}

	passport.serializeUser((user, done) => done(null, user._id));
	passport.deserializeUser((id, done) =>
		utils.db.Collection("users")
		.findOne({ _id: ObjectId(id) })
		.then(user => done(null, user))
		.catch(done)
	);
	passport.use(require("./../authentication/local")(utils));

	for (let middleware of middlewareFiles)
		require(middleware)(app, utils);
	return { csrfProtection };
};