const fs = require("fs");
const { Role } = require("./role");

/**
 * Loads the permissions config and roles.
 * @class
 */
class Registrar {
	constructor(utils) {
		this.definitions = require("./../enums/roles");
		this.raw = JSON.parse(fs.readFileSync(utils.data + "/permissions/all.json"));
		this.roles = {};
		for (let role in this.definitions)
			this.roles[role] = new Role(
				role,
				this.definitions[role] || 0,
				JSON.parse(fs.readFileSync(`${utils.data}/permissions/${role}.json`)),
				this.raw
			);
	}

	Add(role, permissions = []) {
		if (!this.roles[name]) {
			this.roles[name] = new Role(
				role,
				this.definitions[role] || 0,
				permissions,
				this.raw
			);
			return true;
		}
		return false;
	}

	Remove(role) {
		if (this.roles[role]) {
			delete this.roles[role];
			return true;
		}
		return false;
	}
}

module.exports = { Registrar };