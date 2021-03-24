const fs = require("fs");
const { Renderer } = require("./render");

class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const HandleError = async (err, req, res, _, utils) => {
	if (err.statusCode == undefined)
		err.statusCode = "Error!";
	const renderer = new Renderer({
		title: "Error!",
		lang: req.lang,
		user: req.user,
		statusCode: err.statusCode,
		message: err.message,
	}, utils);
	res.send(await renderer.Render(fs.readFileSync(__dirname + "/../public/error.html"), req));
};

module.exports = {
	ErrorHandler,
	HandleError,
};