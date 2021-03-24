module.exports = {
	required: (role) => {
		const middleware = (req, res, next) => {
			if (req.user.role == role)
				next();
			else
				res.redirect("/403");
		};

		middleware.andHigher = (req, res, next) => {
			if (req.user.role >= role)
				next();
			else
				res.redirect("/403");
		};

		middleware.andLower = (req, res, next) => {
			if (req.user.role <= role)
				next();
			else
				res.redirect("/403");
		};

		return middleware;
	}
};