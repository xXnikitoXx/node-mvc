const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const middlewareFiles = fs.readdirSync(__dirname).filter(route => route != "middleware.js").map(route => "./" + route.split(".js")[0]);

let csrfProtection = csrf({ cookie: true });

/**
 * @function
 * @param {Express.Application} app
 * @returns {Object}
 */
module.exports = function(app) {
	app.use(express.static(__dirname + "/../../public"));
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	for (let middleware of middlewareFiles)
		require(middleware)(app, { csrfProtection: csrfProtection });
	return { csrfProtection };
};