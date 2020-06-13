const fs = require("fs");
const { Renderer } = require("./render");

class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const HandleError = (err, req, res) => {
	let { statusCode, message } = err;
	if (statusCode == undefined) statusCode = "Error!";
	let user = false;
	if (req.user)
		user = {
			username: req.user.username,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			joinDate: req.user.joinDate,
		};
	let renderer = new Renderer({
		title: "Website",
		lang: req.lang,
		user: user,
		statusCode,
		message,
	});
	res.send(renderer.Render(fs.readFileSync(__dirname + "/../public/error.html")));
};

module.exports = {
	ErrorHandler,
	HandleError,
};