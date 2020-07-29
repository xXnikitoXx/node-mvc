const fs = require("fs");
const { Validator } = require("./../database/validator");
const dbConfig = JSON.parse(fs.readFileSync(__dirname + "/../../data/dbsettings.json")).mongo.collections;
const userModel = dbConfig.users.model;
const defaultAdmin = dbConfig.users.defaults.admin;
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
		this.utils = utils;
		if (!this.utils.db)
			return;
		this.users = utils.db.Collection("users");
		this.userValidator = new Validator(userModel);
		this.users.findOne({ username: "admin" })
		.then(user => {
			if (user == null)	
				this.Register({
					...defaultAdmin,
					joinDate: Date.now(),
					role: Object.keys(require("./../enums/roles")).length - 1,
				})
				.then(() => {})
				.catch(console.log);
		})
		.catch(console.log);
	}

	Register(data) {
		if (!this.utils.db)
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
										data.password = crypto.SHA256(this.utils.appSettings.secret + data.password + data.joinDate).toString();
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

	Find(filter) {
		if (!this.utils.db)
			return;
		return this.users.find(filter);
	}

	DeleteOne(filter) {
		if (!this.utils.db)
			return;
		return this.users.deleteOne(filter);
	}

	DeleteMany(filter) {
		if (!this.utils.db)
			return;
		return this.users.deleteMany(filter);
	}
}

module.exports = { AccountManager };