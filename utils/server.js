const express = require("express");
const { Logger } = new require("./logger");
const http = require("http");
const https = require("https");
const fs = require("fs");

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
		if (production)
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
		return new Promise((resolve, reject) => {
			require("./database/database").then(db => {
				this.db = db;
				this.app = express();
				this.middleware = require("./middleware/middleware")(this.app);
				require("./routes/routes")(this.app, { logger: this.logger, csrfProtection: this.middleware.csrfProtection, db: this.db });
				this.port = port || 80;
				this.securePort = securePort || 443;
				this.httpServer = http.createServer(this.app).listen(this.port);
				this.logger.messages.listening(this.port);
				if (this.production) {
					let httpsServer = https.createServer(this.sslCredentials, this.app);
					httpsServer.listen(this.securePort);
					this.logger.messages.listening(this.securePort);
				}
				resolve();
			});
		});
	}
}

module.exports = { Server };