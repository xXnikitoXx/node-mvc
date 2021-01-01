const fs = require("fs");
const config = JSON.parse(fs.readFileSync(__dirname + "/../data/appsettings.json"));
const colors = require("colors/safe");
const readline = require("readline-sync");

const gb = colors.green.bold;
const yb = colors.yellow.bold;
const rb = colors.red.bold;
const g = colors.green;
const y = colors.yellow;
const r = colors.red;
const m = colors.magenta;

const l = config.logging ? (arg = "") => console.log(arg) : () => {};
const lg = config.logging ? console.log : () => {};
const e = (err) => l(rb(err));
let lnl = 50;
const ln = (n = lnl) => l(g("-").repeat(n));

const cmds = commands =>
	commands.map(cmd => "   " + `${gb("•")} ${g(cmd.cmd)} ${cmd.args.map(arg => arg.required ? gb(`<${arg.arg}>`) : g(`[${arg.arg}]`)).join(" ")} - ${m(cmd.description)}`.replace(/\s{2,}/g, " "));

const cmdh = command =>
	Object.entries(command.help).map(([ cmd, help ]) => `\t${gb(" »")} ${gb(cmd)}: ${g(help)}`.replace(/\s{2,}/g, " "));

class Logger {
	constructor() {
		this.messages = {
			builderError: (error) => l(rb("Builder failed:\n" + r(error))),
			builderSuccess: (msg) => l(gb(msg)),
			dbConnected: () => l(gb("Connected to database")),
			dbChecked: () => l(gb("Database checked")),
			dbError: (error) => l(rb("A database error occured:\n") + r(error)),
			dbRequired: () => l(rb("A connection with database is mandatory!\n")),
			dbInserted: (amount) => l(gb("Inserted ") + m(amount) + gb(" records in the database")),
			updateingCollections: () => l(gb("Updating collections")),
			createdCollection: (name) => l(gb("Created collection ") + m(name)),
			removedCollection: (name) => l(gb("Removed collection ") + m(name)),
			configuring: (item, method = "GET") => l(gb("Configuring ") + m(method + " " + item)),
			request: (url) => l(yb("Requested " + url)),
			listening: (port) => l(gb("The server is listening on port: ") + m(port)),
			fsExistError: (name) => e(`File or directory "${name}" does not exist!`),
			stopping: () => l(rb("Stopping server!\n")),
		};

		this.title = title => l(gb(title));
		this.subtitle = subtitle => l(g(subtitle));

		this.text = {
			normal: message => l(g(message)),
			warning: message => l(yb(message)),
			danger: message => l(rb(message)),
		}

		this.line = ln;

		this.listCommands = (title, commands) => {
			l("", ln(), l(g(title)), ln());
			l(cmds(commands).join("\n"));
			ln(lnl, l());
		};

		this.commandUsage = command => {
			ln();
			l(cmds([ command ])[0])
			l(cmdh(command).join("\n"));
			ln();
		}
		
		this.input = {
			normal: message => readline.question(gb(message)),
			warning: message => readline.question(yb(message)),
			danger: message => readline.question(rb(message)),
		};
	}
}

module.exports = { Logger };