const fs = require("fs");

module.exports = (() => {
	describe("Builder functionality", () => {
		const files = fs.readdirSync(__dirname)
			.filter(f => f.includes(".js") && f != "builder.js")
			.map(f => "./" + f.split(".js")[0]);
		files.forEach(require);
	});
})();