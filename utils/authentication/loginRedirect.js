module.exports = {
	required: (req, res, next) => {
		if (!req.user) {
			res.redirect("/login");
			return;
		}
		next();
	},
	forbidden: (req, res, next) => {
		if (!req.user) {
			next();
			return;
		}
		const back = req.header("Referer") || "/";
		res.redirect(back);
	},
};