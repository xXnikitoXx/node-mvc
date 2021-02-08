	async All() {
		return (await this.§plural.find({}).toArray()).map(obj => {
			obj._id = obj._id.toString();
			return obj;
		});
	}