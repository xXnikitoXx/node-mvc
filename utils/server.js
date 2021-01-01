const fs = require("fs");
const path = require("path");
const express = require("express");
const { Logger } = require("./logger");
const { App } = require("./app");
const { Injector } = require("./database/injector");
const { ServiceOrganizer } = require("./services/services");
const { AccountManager } = require("./services/accountManager");
const { PermissionManager } = require("./services/permissionManager");
const { HttpManager } = require("./services/httpManager");
const http = require("http");
const https = require("https");

/**
 * Basic webserver with routing and middleware.
 * @class
 */
class Server {
	/**
	 * Initializes the server.
	 * @param {boolean} log
	 * @param {boolean} production
	 * @constructs Server
	 */
	constructor(log = true, production = false) {
		this.log = log;
		this.production = production;
		this.logger = new Logger(log);
		this.appSettings = JSON.parse(fs.readFileSync(__dirname + "/../data/appsettings.json"));
		if (fs.existsSync(__dirname + "/../certs"))
			this.sslCredentials = {
				ca: fs.readFileSync(__dirname + "/.." + this.appSettings.ssl.ca),
				key: fs.readFileSync(__dirname + "/.." + this.appSettings.ssl.key),
				cert: fs.readFileSync(__dirname + "/.." + this.appSettings.ssl.cert),
			};
	}

	/**
	 * Start the server.
	 * @param {number} port 
	 * @param {number} securePort 
	 */
	Run(port = process.env.PORT, securePort = process.env.SECURE_PORT) {
		return new Promise(async (resolve, reject) => {
			if (this.appSettings.connectToDatabase)
				try {
					this.dbConnect = require("./database/database");
					this.db = await this.dbConnect;
					this.db.EnsureCreated();
				} catch {
					if (this.appSettings.databaseRequired) {
						this.logger.messages.dbRequired();
						this.logger.messages.stopping();
						process.exit();
					}
				}
			this.app = new App(express());
			let production = this.production;
			let utils = {
				get production() { return production; },
				appSettings: this.appSettings,
				dbSettings: this.dbSettings,
				logger: this.logger,
				db: this.db,
				public: path.join(__dirname + "/../public"),
				data: path.join(__dirname + "/../data"),
				middleware: path.join(__dirname + "/middleware"),
				routes: path.join(__dirname + "/routes"),
				enums: path.join(__dirname + "/enums"),
				servicesPath: path.join(__dirname + "/services"),
				services: [],
			};
			utils.templates = require("./templates")(utils);
			this.app.utils = utils;
			utils.httpManager = new HttpManager();
			this.middleware = require("./middleware/middleware")(this.app, utils);
			this.injector = new Injector(utils);
			await resolve();
			this.organizer = new ServiceOrganizer(utils);
			require("./routes/routes")(this.app, utils);
			this.port = port || 80;
			this.securePort = securePort || 443;
			this.httpServer = http.createServer(this.app.instance).listen(this.port);
			this.logger.messages.listening(this.port);
			if (!this.appSettings.proxied) {
				let httpsServer = https.createServer(this.sslCredentials, this.app.instance);
				httpsServer.listen(this.securePort);
				this.logger.messages.listening(this.securePort);
			}
		});
	}

	async Inject(collection, pattern, file) {
		try {
			await this.injector
			.InsertFile(collection, pattern, path.join(__dirname + "/../" + file));
			this.logger.messages.dbInserted(1);
		} catch (e) {
			this.logger.messages.dbError(e);
		}
	}
}

module.exports = { Server };