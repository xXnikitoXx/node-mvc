const fs = require("fs");
const { Validator } = require("./../database/validator");
const dbConfig = JSON.parse(fs.readFileSync(__dirname + "/../../data/dbsettings.json")).mongo.collections;
const userModel = dbConfig.users.model;
const crypto = {
	SHA256: require("sha256"),
	MD5: require("md5"),
};

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Controls main user collections.
 * @class
 */
class AccountManager {
	/**
	 * Initializes new account manager.
	 * @param {any} utils
	 * @constructs AccountManager
	 */
	constructor(utils) {
		if (!utils.db)
			return;
		this.utils = utils;
		this.users = utils.db.Collection("users");
		this.userValidator = new Validator(userModel);
	}

	Register(data) {
		if (!utils.db)
			return;
		return new Promise((resolve, reject) => {
			this.users
			.find({ normalized: data.normalized })
			.count()
			.then(count => {
				if (count == 0)
					this.users
					.find({ email: data.email })
					.count()
					.then(count => {
						if (count == 0)
							if (data.email.match(emailRegex) != null)
								if (data.password == data.confirmPassword) {
									delete data.confirmPassword;
									delete data._csrf;
									data.normalized = data.username.toUpperCase();
									data.joinDate = Date.now();
									if (this.userValidator.IsValid(data)) {
										data.password = crypto.SHA256(data.username + data.password + data.joinDate).toString();
										this.users
										.insertOne(data)
										.then(() => {
											this.utils.logger.messages.dbInserted(1);
											resolve();
										});
									}
									else reject(4);
								}
								else reject(3);
							else reject(2);
						else reject(1);
					});
				else reject(0);
			});
		});
	}
}

module.exports = { AccountManager };