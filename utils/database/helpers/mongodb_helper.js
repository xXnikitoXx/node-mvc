class DBHelper {
	constructor(name, dbsettings, client, logger) {
		this.dbName = name;
		this.dbSettings = dbsettings.mongo;
		this.client = client;
		this.db = this.client.db(this.dbName);
		this.logger = logger;
	}

	get Collections() {
		return this.db.listCollections({}, { nameOnly: true }).toArray();
	}

	get Name() { return this.dbName; }
	get Client() { return this.client; }

	EnsureCreated() {
		this.Collections.then(data => {
			this.collections = data.map(x => x.name);
			for (const collection in this.dbSettings.collections) {
				if (!this.collections.some(x => x == collection))
					this.db.createCollection(collection)
						.then(() => this.logger.messages.createdCollection(collection))
						.catch(err => this.logger.messages.dbError(err));
			}
			this.logger.messages.dbChecked();			
		}).catch(err => this.logger.messages.dbError(err));
	}

	Collection(name) {
		const collection = this.db.collection(name);
		return collection;
	}

	Find(collection, object) {
		if (typeof collection === "string")
			collection = this.Collection(collection);
		return collection.findOne(object);
	}

	Insert(collection, objects) {
		if (typeof collection === "string")
			collection = this.Collection(collection);
		if (!Array.isArray(objects))
			objects = [ objects ];
		this.logger.messages.dbInserted(objects.length);
		collection.insertMany(objects);
	}

	static Generate(factory, constraints, amount) {
		return factory.Generate(amount, constraints);
	}
}

module.exports = { DBHelper };