const fs = require("fs");
const path = require("path");
const { Validator } = require("./../database/validator");
const dbConfig = JSON.parse(fs.readFileSync(__dirname + "/../../data/dbsettings.json")).mongo.collections;
const §singularModel = dbConfig.§plural.model;

/**
 * §description.
 * @class
 */
class §Name {
	/**
	 * Initializes new §Name.
	 * @param {any} utils
	 * @constructs §Name
	 */
	constructor(utils) {
		this.utils = utils;
		this.§plural = utils.db.Collection("§plural");
		this.validator = new Validator(§singularModel);
		this.validatorError = "Invalid §singular model!";
	}

§methods
}

module.exports = { §Name };