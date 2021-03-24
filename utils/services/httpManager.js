const fetch = require("node-fetch");

class HttpManager {
	static async get(url, headers = []) {
		return await fetch(url, {
			method: "GET",
			headers,
		});
	}

	static async head(url, headers = []) {
		return await fetch(url, {
			method: "HEAD",
			headers,
		});
	}

	static async delete(url, headers = []) {
		return await fetch(url, {
			method: "DELETE",
			headers,
		});
	}

	static async options(url, headers = []) {
		return await fetch(url, {
			method: "OPTIONS",
			headers,
		});
	}

	static async post(url, body, headers = []) {
		return await fetch(url, {
			method: "POST",
			headers,
			body,
		});
	}

	static async put(url, body, headers = []) {
		return await fetch(url, {
			method: "PUT",
			headers,
			body,
		});
	}

	static async patch(url, body, headers = []) {
		return await fetch(url, {
			method: "PATCH",
			headers,
			body,
		});
	}

	static async trace(url, body, headers = []) {
		return await fetch(url, {
			method: "TRACE",
			headers,
			body,
		});
	}

	static async connect(url, body, headers = []) {
		return await fetch(url, {
			method: "CONNECT",
			headers,
			body,
		});
	}
}

module.exports = { HttpManager };