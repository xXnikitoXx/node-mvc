const path = require("path");
const express = require("express");
const { Logger } = new require("./logger");
const { Injector } = require("./database/injector");
const { AccountManager } = require("./services/accountManager");
const { PermissionManager } = require("./services/permissionManager");
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
		this.dbConnect = require("./database/database");
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
					this.db = await this.dbConnect;
					db.EnsureCreated();
				} catch {
					if (this.appSettings.databaseRequired) {
						this.logger.message.dbRequired();
						this.logger.message.stopping();
						process.exit();
					}
				}
			this.app = express();
			let utils = {
				logger: this.logger,
				db: this.db,
				public: path.join(__dirname + "/../public"),
				data: path.join(__dirname + "/../data"),
				middleware: path.join(__dirname + "/../middleware"),
				routes: path.join(__dirname + "/../routes"),
				enums: path.join(__dirname + "/../enums"),
			};
			utils.accountManager = new AccountManager(utils);
				utils.permissionManager = new PermissionManager(utils.accountManager, utils);
			this.middleware = require("./middleware/middleware")(this.app, utils);
			require("./routes/routes")(this.app, utils);
			this.injector = new Injector(utils);
			this.port = port || 80;
			this.securePort = securePort || 443;
			this.httpServer = http.createServer(this.app).listen(this.port);
			this.logger.messages.listening(this.port);
			let httpsServer = https.createServer(this.sslCredentials, this.app);
			httpsServer.listen(this.securePort);
			this.logger.messages.listening(this.securePort);
			resolve();
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