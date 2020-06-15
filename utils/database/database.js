const fs = require("fs");
const { MongoClient, Db } = require("mongodb");
const { DBHelper } = require("./helpers/mongodb_helper");
const { Logger } = new require("./../logger");
let logger = new Logger();
const appSettings = JSON.parse(fs.readFileSync(__dirname + "/../../data/appsettings.json"));
const dbSettings = JSON.parse(fs.readFileSync(__dirname + "/../../data/dbsettings.json"));

module.exports = new Promise((resolve, reject) => {
	let db;
	MongoClient.connect(appSettings.connectionString, { useUnifiedTopology: true }, (err, client) => {
		if (err) {
			logger.messages.dbError(err);
			reject(err);
			return;
		}
		logger.messages.dbConnected();
		db = new DBHelper(appSettings.database, dbSettings, client, logger);
		resolve(db);
	});
});