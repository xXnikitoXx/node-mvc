class Constraint {
	constructor(target, properties) {
		this.target = target;
		this.type = null;
		this.min = -Infinity;
		this.max = Infinity;
		this.decimals = 10;
		this.pattern = "";
		for (let property in properties)
			this[property] = properties[property];
	}

	set Min(value) {
		this.min = value;
		return this;
	}

	set Max(value) {
		this.min = value;
		return this;
	}

	set Type(value) {
		this.type = value;
		return this;
	}

	set Pattern(value) {
		this.pattern = value;
		return this;
	}
}

class Constraints {
	constructor() {
		this.constraints = [];
	}

	set New(constraint) {
		this.constraints.push(constraint);
		return this;
	}

	get All() { return this.constraints; }
}

module.exports = { Constraint, Constraints };