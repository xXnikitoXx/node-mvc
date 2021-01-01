const fs = require("fs");
const path = require("path");
const { Validator } = require("./../database/validator");
const dbConfig = JSON.parse(fs.readFileSync(__dirname + "/../../data/dbsettings.json")).mongo.collections;
const userModel = dbConfig.users.model;

/**
 * §description.
 * @class
 */
class §name {
	/**
	 * Initializes new §name.
	 * @param {any} utils
	 * @constructs §name
	 */
	constructor(utils) {
		this.utils = utils;
		this.users = utils.db.Collection("users");

	}
}

module.exports = { AccountManager };