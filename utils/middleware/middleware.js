const fs = require("fs");
const { ObjectId } = require("mongodb");
const express = require("express");
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
module.exports = function(app, utils) {
	utils.passport = passport;
	utils.loginRedirect = loginRedirect;
	utils.csrfProtection = csrfProtection;
	app.use(express.static(__dirname + "/../../public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json({ type: [ "application/json", "text/plain"] }));
	app.use(cookieParser());
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
	app.use(function (req, res, next) {
		res.setHeader("X-Powered-By", "Tech Lab");
		next();
	});
	
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