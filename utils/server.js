const fs = require("fs");
const path = require("path");
const express = require("express");
const { Logger } = require("./logger");
const { App } = require("./app");
const { Injector } = require("./database/injector");
const { AccountManager } = require("./services/accountManager");
const { PermissionManager } = require("./services/permissionManager");
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
					db.EnsureCreated();
				} catch {
					if (this.appSettings.databaseRequired) {
						this.logger.message.dbRequired();
						this.logger.message.stopping();
						process.exit();
					}
				}
			this.app = new App(express());
			let utils = {
				appSettings: this.appSettings,
				dbSettings: this.dbSettings,
				logger: this.logger,
				db: this.db,
				public: path.join(__dirname + "/../public"),
				data: path.join(__dirname + "/../data"),
				middleware: path.join(__dirname + "/../middleware"),
				routes: path.join(__dirname + "/../routes"),
				enums: path.join(__dirname + "/../enums"),
			};
			utils.templates = {
				list: [],
				register(path, urls = []) {
					if (!this.load(path))
					this.list.push({
						id: path,
						cache: null,
						urls,
					});
				},
				load(template, targetObject = false) {
					let match = this.list.filter(t => t.id == template);
					if (match.length > 0)
						if (match[0].cache == null)
							return (() => {
								let target = path.join(utils.public, template.replace(/[\s\\\.\-]/g, "/")) + ".html";
								if (fs.existsSync(target))
									match[0].cache = fs.readFileSync(target).toString();
								return targetObject ? match[0] : match[0].cache;
							})();
						else return targetObject ? match[0] : match[0].cache;
					else return null;
				},
				loadByUrl(url, targetObject = false) {
					let match = this.list.filter(t => t.urls.some(u => u == url));
					if (match.length > 0)
						if (match[0].cache == null)
							return (() => {
								let target = path.join(utils.public, match[0].id.replace(/[\s\\\.\-]/g, "/")) + ".html";
								if (fs.existsSync(target))
									match[0].cache = fs.readFileSync(target).toString();
								return targetObject ? match[0] : match[0].cache;
							})();
						else return targetObject ? match[0] : match[0].cache;
					else return null;
				},
				isRedirect(url) {
					let template = this.loadByUrl(url, true);
					if (template)
						return template.id == "redirect";
					return false;
				}
			};
			this.app.utils = utils;
			utils.accountManager = new AccountManager(utils);
				utils.permissionManager = new PermissionManager(utils.accountManager, utils);
			this.middleware = require("./middleware/middleware")(this.app, utils);
			require("./routes/routes")(this.app, utils);
			this.injector = new Injector(utils);
			this.port = port || 80;
			this.securePort = securePort || 443;
			this.httpServer = http.createServer(this.app.instance).listen(this.port);
			this.logger.messages.listening(this.port);
			if (!this.appSettings.proxied) {
				let httpsServer = https.createServer(this.sslCredentials, this.app.instance);
				httpsServer.listen(this.securePort);
				this.logger.messages.listening(this.securePort);
			}
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