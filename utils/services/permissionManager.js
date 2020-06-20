const { Registrar } = require("./../permissions/registrar");

/**
 * Manages roles and permissions.
 * @class
 */
class PermissionManager {
	constructor(accountManager, utils) {
		this.accountManager = accountManager;
		this.registrar = new Registrar(utils);
		this.rolesEnum = require("./../enums/roles");
	}

	get Roles() { return Object.keys(this.registrar.roles); }
	get RoleObjects() {
		return this.Roles.splice(0, this.Roles.length - 1)
		.map(role => ({ name: role, importance: this.rolesEnum[role] }));
	}

	Add(role, permissions = []) { this.registrar.roles[role].Add(role, permissions); }
	Remove(role) { this.RoleObjects[role].Remove(role); }

	Has(role, permission) { return this.registrar.roles[role].Can(permission); }
	HasNot(role, permission) { return this.registrar.roles[role].Cannnot(permission); }

	Give(role, permission) { this.registrar.roles[role].Permit(permission); }
	Take(role, permission) { this.registrar.roles[role].Forbid(permission); }
}

module.exports = { PermissionManager };