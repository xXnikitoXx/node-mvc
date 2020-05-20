class DBHelper {
	constructor(name, dbsettings, client, logger) {
		this.dbName = name;
		this.dbSettings = dbsettings.mongo;
		this.client = client;
		this.db = this.client.db(this.dbName);
		this.logger = logger;
	}

	get Collections() {
		this.logger.messages
		return this.db.listCollections({}, { nameOnly: true }).toArray();
	}

	EnsureCreated() {
		this.Collections.then(data => {
			this.collections = data.map(x => x.name);
			for (let collection in this.dbSettings.collections) {
				if (!this.collections.some(x => x == collection))
					this.db.createCollection(collection)
						.then(data => this.logger.messages.createdCollection(collection))
						.catch(err => this.logger.messages.dbError(err));
			}
			this.logger.messages.dbChecked();			
		}).catch(err => this.logger.messages.dbError(err));
	}

	Collection(name) {
		let collection = this.db.collection(name);
		return collection;
	}

	Insert(collection, objects) {
		if (typeof collection == "string")
			collection = this.Collection(collection);
		if (!Array.isArray(objects))
			objects = [ objects ];
		this.logger.messages.dbInserted(objects.length);
		collection.insertMany(objects);
	}

	Generate(factory, constraints, amount) {
		let objects = factory.Generate(amount, constraints);
		return objects;
	}
}

module.exports = { DBHelper };