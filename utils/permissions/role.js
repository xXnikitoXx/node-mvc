class Role {
	constructor(name, importance, permissions, permissionsList) {
		this.name = name;
		this.importance = importance;
		this.permissions = [];
		this.permissionsList = permissionsList;
		for (const p of permissions)
			this.AddRule(p);
	}

	AddRule(permission) {
		switch (permission[0]) {
			case "+":
				this.Permit(permission.slice(1));
				break;
			case "-":
				this.Forbid(permission.slice(1));
				break;
			default:
				this[this.permissions.some(p => p.name == permission) ? "Forbid" : "Permit"](permission);
				break;
		}
	}

	Permit(permission) {
		if (permission.includes("*")) {
			const beginning = permission.split("*")[0];
			if (this.permissions.some(p => p.name == beginning + "*"))
				this.permissions.filter(p => p.name == beginning + "*")[0].allow = true;
			else
				this.permissions.push({ name: beginning + "*", allow: true });
			for (const permission of this.permissionsList.filter(p => p.startsWith(beginning)))
				this.Permit(permission);
		} else {
			if (this.permissions.some(p => p.name == permission))
				this.permissions.filter(p => p.name == permission)[0].allow = true;
			else
				this.permissions.push({ name: permission, allow: true });
		}
	}

	Forbid(permission) {
		if (permission.includes("*")) {
			const beginning = permission.split("*")[0];
			if (this.permissions.some(p => p.name == beginning + "*"))
				this.permissions.filter(p => p.name == beginning + "*")[0].allow = false;
			else
				this.permissions.push({ name: beginning + "*", allow: false });
			for (const permission of this.permissionsList.filter(p => p.startsWith(beginning)))
				this.Forbid(permission);
		} else {
			if (this.permissions.some(p => p.name == permission))
				this.permissions.filter(p => p.name == permission)[0].allow = false;
			else
				this.permissions.push({ name: permission, allow: false });
		}
	}

	Can(permission) {
		const permitted = this.permissions.filter(p => p.allow);
		if (typeof permission !== "string")
			permission = "none";
		return permitted.some(p => p.name == permission);
	}

	Cannot(permission) {
		return !this.Can(permission);
	}
}

module.exports = { Role };