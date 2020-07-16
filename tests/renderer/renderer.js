const fs = require("fs");
const { Renderer } = require("../../utils/render");

module.exports = (() => {
	describe("Renderer functionality", () => {
		const files = fs.readdirSync(__dirname)
			.filter(f => f.includes(".js") && f != "renderer.js")
			.map(f => "./" + f.split(".js")[0]);
		files.forEach(require);
	});
})();