	async Find(id) {
		return await this.§plural.findOne({ _id: ObjectId(id) });
	}