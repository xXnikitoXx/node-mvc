const fetch = require("node-fetch");

class HttpManager {
	async get(url, headers = []) {
		return await fetch(url, {
			method: "GET",
			headers,
		});
	}

	async post(url, body, headers = []) {
		return await fetch(url, {
			method: "POST",
			headers,
			body,
		});
	}
}

module.exports = { HttpManager };