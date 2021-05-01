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
const middlewareFiles = fs.readdirSync(__main + "/utils/middleware")
	.filter(route => route != "middleware.js")
	.map(route => "./" + route.split(".js")[0]);
const csrfProtection = csrf({ cookie: true });

/**
 * @function
 * @param {Express.Application} app
 * @returns {Object}
 */
module.exports = (app, utils) => {
	utils.passport = passport;
	utils.loginRedirect = loginRedirect;
	utils.csrfProtection = csrfProtection;
	utils.sources = JSON.parse(fs.readFileSync(utils.data + "/sources.json").toString());
	utils.features = JSON.parse(fs.readFileSync(utils.data + "/features.json").toString());
	app.use(express.static(__main + "/public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json({ type: [ "application/json", "text/plain"] }));
	app.use(cookieParser());
	app.use(helmet());
	app.use((req, res, next) => {
		res.setHeader("Permissions-Policy", utils.features.join("; "));
		res.setHeader("Content-Security-Policy", Object.keys(utils.sources).map(src => `${src}-src ${utils.sources[src].join(" ")}`).join("; "));
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

	for (const middleware of middlewareFiles)
		require(middleware)(app, utils);
	return { csrfProtection };
};