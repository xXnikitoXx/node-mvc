	async Write§Singular(§singular) {
		if (this.validator.IsValid(§singular)) {
			let _id = null;
			let result = null;
			if (§singular)
				if (§singular._id) {
					_id = ObjectId(§singular._id);
					delete §singular._id;
					result = await this.§plural.findOneAndUpdate(_id != null ? { _id } : {}, { $set: §singular }, { upsert: true });
				} else
					result = await this.§plural.insertOne(§singular);
			return (result.value && result.value._id) || result._id || result.insertedId;
		}
		throw new Error(this.validatorError);
	}