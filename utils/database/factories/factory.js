const fs = require("fs");

class Factory {
	constructor(object, dictionary) {
		this.properties = object;
		this.dicionary = typeof dictionary == "string" ? JSON.parse(fs.readFileSync(dictionary)) : dictionary;
	}

	static RandomInteger(constraint) {
		return Math.floor(constraint.min + Math.random() * (constraint.max - constraint.min));
	}

	static RandomFloat(constraint) {
		const value = constraint.min + Math.random() * (constraint.max - constraint.min);
		return constraint.decimals == -1 ?
			value : Number(Math.round(value + "e" + constraint.decimals) + "e-" + constraint.decimals);
	}

	RandomText(constraint) {
		if (typeof constraint.pattern === "string")
			for (const property in this.dicionary)
				constraint.pattern =
					constraint.pattern.replace(`{{${property}}}`, this.dicionary[property][Math.floor(Math.random() * (this.dicionary[property].length - 1))]);
		return constraint.pattern;
	}

	RandomValue(constraint) {
		switch(constraint.type) {
			case "string":
				return this.RandomText(constraint);
			case "integer":
				return Factory.RandomInteger(constraint);
			case "float":
				return Factory.RandomFloat(constraint);
		}
		return null;
	}
	
	RandomObject(constraints) {
		const instance = {};
		for (const property in this.properties) {
			const target = constraints.filter(c => c.target == property)[0];
			instance[property] = this.RandomValue(target);
		}
		return instance;
	}

	Generate(amount, constraints) {
		const objects = [];
		while (amount-- > 0)
			objects.push(this.RandomObject(constraints));
		return objects;
	}
}

module.exports = { Factory };