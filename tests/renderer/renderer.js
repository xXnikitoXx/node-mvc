const fs = require("fs");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("Renderer functionality", () => {
		const files = fs.readdirSync(__dirname)
			.filter(f => f.includes(".js") && f != "renderer.js")
			.map(f => "./" + f.split(".js")[0]);
		files.forEach(require);
	});
})();