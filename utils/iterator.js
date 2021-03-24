class Iterator {
	constructor(object) {
		this.object = object;
		this.list = [];
	}

	ListItems() {
		this.list = [];
		this.Iterate(this.object, '');
		return this.list;
	}

	Iterate(obj, stack) {
		for (const property in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, property)) {
				if (typeof obj[property] == "object")
					this.Iterate(obj[property], stack + '.' + property);
				else {
					const item = { name: stack + '.' + property, value: obj[property] };
					if (item.name[0] == ".")
						item.name = item.name.slice(1);
					this.list.push(item);
				}
			}
		}
	}
}

module.exports = { Iterator };