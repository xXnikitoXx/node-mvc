const fs = require("fs");
const { Renderer } = require("./render");

class ErrorHandler extends Error {
	constructor(statusCode, message) {
		super();
		this.statusCode = statusCode;
		this.message = message;
	}
}

const HandleError = (err, res) => {
	let { statusCode, message } = err;
	let renderer = new Renderer({ statusCode, message });
	res.send(renderer.Render(fs.readFileSync(__dirname + "/../public/error.html")));
};

module.exports = {
	ErrorHandler,
	HandleError,
};