const fs = require("fs");
const config = JSON.parse(fs.readFileSync(__dirname + "/../data/appsettings.json"));
const colors = require("colors/safe");

const gb = colors.green.bold;
const yb = colors.yellow.bold;
const rb = colors.red.bold;
const r = colors.red;
const m = colors.magenta;

const l = config.logging ? console.log : function() {};
const e = (err) => l(rb(err));

class Logger {
	constructor() {
		this.messages = {
			dbConnected: () => l(gb("Connected to database")),
			dbChecked: () => l(gb("Database checked")),
			dbError: (error) => l(rb("A database error occured:\n") + r(error)),
			dbInserted: (amount) => l(gb("Inserted ") + m(amount) + gb(" records in the database")),
			updateingCollections: () => l(gb("Updating collections")),
			createdCollection: (name) => l(gb("Created collection ") + m(name)),
			removedCollection: (name) => l(gb("Removed collection ") + m(name)),
			configuring: (item, method = "GET") => l(gb("Configuring ") + m(method + " " + item)),
			request: (url) => l(yb("Requested " + url)),
			listening: (port) => l(gb("The server is listening on port: ") + m(port)),
			fsExistError: (name) => e(`File or directory "${name}" does not exist!`),
		};
	}
}

module.exports = { Logger };