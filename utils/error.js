const fs = require("fs");
const { Renderer } = require("./render");

class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const HandleError = (err, req, res, utils) => {
	let { statusCode, message } = err;
	if (statusCode == undefined) statusCode = "Error!";
	let renderer = new Renderer({
		title: "Website",
		lang: req.lang,
		user: req.user,
		statusCode,
		message,
	}, utils);
	res.send(renderer.Render(fs.readFileSync(__dirname + "/../public/error.html")));
};

module.exports = {
	ErrorHandler,
	HandleError,
};