const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("view", () => {
		const target = path.join(__dirname, "/../../public/test.html");
		// eslint-disable-next-line no-undef
		it("creates view by given arguments", () => {
			const args = [ logger, "view", "test" ];
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.existsSync(target)).to.be.true;
		});
		// eslint-disable-next-line no-undef
		it("deletes view by given name", () => {
			const args = [ logger, "view", "test" ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(target)).to.be.false;
		});
	});
})();