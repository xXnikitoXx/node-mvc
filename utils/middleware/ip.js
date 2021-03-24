/**
 * Initializes IP check.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = app => {
	const trim = str =>
		(str || "").split(",").pop().trim();

	app.use((req, _, next) => {
		req.IP = trim(
			req.headers["x-client-ip"] ||
			req.headers["x-forwarded-for"] ||
			req.headers["cf-connectiong-ip"] ||
			req.headers["fastly-client-ip"] ||
			req.headers["true-client-ip"] ||
			req.headers["x-real-ip"] ||
			req.headers["x-cluster-client-ip"] ||
			req.headers["x-forwarded"] ||
			req.headers["forwarded-for"] ||
			req.headers["forwarded"] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			req.connection.socket &&
			req.connection.socket.remoteAddress ||
			req.info &&
			req.info.remoteAddress
		);
		if (req.IP !== null)
			if (req.IP.includes("::ffff:"))
				req.IP = req.IP.substr(7);
		next();
	});
};