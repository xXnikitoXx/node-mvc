const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("controller", () => {
		const target = path.join(__dirname, "/../../utils/routes/test.js");
		// eslint-disable-next-line no-undef
		it("creates controller by given arguments", () => {
			const args = [ logger, "controller", "test", "this is a test controller", {} ];
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.existsSync(target)).to.be.true;
		});
		// eslint-disable-next-line no-undef
		it("deletes controller by given name", () => {
			const args = [ logger, "controller", "test", {} ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(path.join(__dirname, "/../../utils/routes/test.js"))).to.be.false;
		});
	});
})();