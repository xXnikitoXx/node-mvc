const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("service", () => {
		const target = path.join(__dirname, "/../../utils/services/test.js");
		// eslint-disable-next-line no-undef
		it("creates service by given arguments", () => {
			const args = [ logger, "service", "test", "this is a test service", {} ];
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.existsSync(target)).to.be.true;
		});
		// eslint-disable-next-line no-undef
		it("deletes service by given name", () => {
			const args = [ logger, "service", "test", {} ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(path.join(__dirname, "/../../utils/services/test.js"))).to.be.false;
		});
	});
})();