const fetch = require("node-fetch");

class HttpManager {
	async get(url, headers = []) {
		return await fetch(url, {
			method: "GET",
			headers,
		});
	}

	async head(url, headers = []) {
		return await fetch(url, {
			method: "HEAD",
			headers,
		});
	}

	async delete(url, headers = []) {
		return await fetch(url, {
			method: "DELETE",
			headers,
		});
	}

	async options(url, headers = []) {
		return await fetch(url, {
			method: "OPTIONS",
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

	async put(url, body, headers = []) {
		return await fetch(url, {
			method: "PUT",
			headers,
			body,
		});
	}

	async patch(url, body, headers = []) {
		return await fetch(url, {
			method: "PATCH",
			headers,
			body,
		});
	}

	async trace(url, body, headers = []) {
		return await fetch(url, {
			method: "TRACE",
			headers,
			body,
		});
	}

	async connect(url, body, headers = []) {
		return await fetch(url, {
			method: "CONNECT",
			headers,
			body,
		});
	}
}

module.exports = { HttpManager };