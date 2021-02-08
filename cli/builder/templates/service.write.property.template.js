	async Update§Prop(§singular, §prop) {
		let previous = §singular.§prop;
		§singular.§prop = §prop;
		try {
			await this.Write§Singular(§singular);
		} catch (error) {
			§singular.§prop = previous;
			throw error;
		}
	}