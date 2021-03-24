class Constraint {
	constructor(target, properties) {
		this.target = target;
		this.type = null;
		this.min = -Infinity;
		this.max = Infinity;
		this.decimals = 10;
		this.pattern = "";
		for (const property in properties)
			this[property] = properties[property];
	}

	set Min(value) {
		this.min = value;
	}

	set Max(value) {
		this.min = value;
	}

	set Type(value) {
		this.type = value;
	}

	set Pattern(value) {
		this.pattern = value;
	}
}

class Constraints {
	constructor() {
		this.constraints = [];
	}

	set New(constraint) {
		this.constraints.push(constraint);
	}

	get All() { return this.constraints; }
}

module.exports = { Constraint, Constraints };