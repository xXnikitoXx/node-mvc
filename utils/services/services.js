const fs = require("fs");
const path = require("path");

const closingBracket = str => {
	let depth = 1;
	for (let i = 0; i < str.length; i++)
		switch (str[i]) {
			case "(":
				depth++;
				break;
			case ")":
				if (--depth == 0)
					return i;
				break;
		}
	return -1;
}

class ServiceOrganizer {
    constructor(utils) {
		this.utils = utils;
		this.path = path.join(utils.servicesPath);
		this.paths = fs.readdirSync(this.path)
			.filter(p => p != "services.js")
			.map(p => `${this.path}/${p}`);
		this.services = ServiceOrganizer.LoadServices(this.paths);
		this.dependencies = DependencyManager.OrderDependencies(this.services);
		this.depsManager = new DependencyManager(utils, this.services);
		this.depsManager.CreateInstances();
		this.utils.services = this.depsManager.instances;
	}

	static LoadServices(paths) {
		let services = [];
		for (let path of paths)
			services.push(DependencyManager.ServiceFrom(path));
		return services;
	}
}

class DependencyManager {
	constructor(utils, services) {
		this.utils = utils;
		this.services = services;
		this.instances = [
			{
				name: "utils",
				dependencies: [],
				type: typeof(Object),
				object: utils,
				initial: utils,
			}
		];
		this.reflected = [];
	}

	Find(name) {
		return this.instances.filter(s => s.name.toLowerCase() == name.toLowerCase())[0];
	}

	CreateInstances() {
		this.services.map(s => this.CreateInstanceOf(s));
		this.reflected.map(r => this.Find(r)).map(r => this.CreateInstanceOf(r));
	}

	CreateInstanceOf(service, referer) {
		if (service == undefined)
			return;
		if (service.name == "utils")
			return;
		if (referer != undefined) {
			let dependant = DependencyManager.MutuallyDependent(service, referer) &&
				!(this.reflected.includes(service.name) && this.reflected.includes(referer.name));
			if (dependant) {
				let instance = DependencyManager.Reflect(service.type);
				this.reflected.push(service.name);
				let found = false;
				for (let i = 0; i < this.instances.length; i++)
					if (this.instances[i].name.toLowerCase() == service.name.toLowerCase()) {
						found = true;
						this.instances[i].object = instance;
						this.instances[i].initial = instance;
						break;
					}
				if (!found)
					this.instances.push({
						...service,
						object: instance,
						initial: instance,
					});
			}
		} else
			for (let dep of service.dependencies) {
				dep = this.Find(dep);
				if (dep != undefined)
					this.CreateInstanceOf(dep, service);
			}
		let ctorProps = service.dependencies.map(d => d == "utils" ? this.utils : this.Find(d));
		let i = 0;
		let ctorPropStr = "";
		ctorProps.map(p => ctorPropStr += `ctorProps[${i++}],`);
		ctorPropStr = `new service.type(${ctorPropStr})`.replace(",)", ")");
		let instance = eval(ctorPropStr);
		let found = false;
		for (let i = 0; i < this.instances.length; i++)
			if (this.instances[i].name.toLowerCase() == service.name.toLowerCase()) {
				found = true;
				this.instances[i].object = instance;
				this.instances[i].initial = instance;
				break;
			}
		if (!found)
			this.instances.push({
				...service,
				object: instance,
				initial: instance,
			});
	}

	static MutuallyDependent(serviceA, serviceB) {
		return serviceA.dependencies.some(d => d.toLowerCase() == serviceB.name.toLowerCase()) &&
			serviceB.dependencies.some(d => d.toLowerCase() == serviceA.name.toLowerCase());
	}

	/**
	 * @param {String} path
	 */
	static ServiceFrom(path) {
		let type = require(path);
		let key = Object.keys(type)[0];
		type = type[key];
		let service = {
			name: type.name,
			dependencies: DependencyManager.GetDependencies(type),
			type,
			object: null,
			initial: null,
		};
		return service;
	}

	/**
	 * @param {[Function: any]} type
	 * Gets dependencies of given class.
	 */
	static GetDependencies(type) {
		let ctorStr = type.prototype.constructor.toString();
		if (!ctorStr.includes("constructor"))
			return [];
		ctorStr = ctorStr.split("constructor")[1];
		ctorStr = ctorStr.slice(ctorStr.indexOf("(") + 1);
		return ctorStr.slice(0, closingBracket(ctorStr)).split(", ");
	}

	/**
	 * @param {Array} services
	 * Returns services' names ordered from least to most used.
	 */
	static OrderDependencies(services) {
		let list = {};
		let deps = [];
		services.map(service => deps = deps.concat(service.dependencies));
		for (let s of deps)
			if (list[s] != undefined)
				list[s] += 1;
			else
				list[s] = 1;
		return Object.entries(list).sort((a, b) => a[1] - b[1]);
	}

	/**
	 * @param {[Function: any]} type
	 * Get instance of class without calling the constructor.
	 */
	static Reflect(type) {
		return Object.create(type.prototype);
	}
}

module.exports = { ServiceOrganizer, DependencyManager };