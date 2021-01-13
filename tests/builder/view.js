const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	describe("view", () => {
		let target = path.join(__dirname, "/../../public/test.html");

		it("creates view by given arguments", () => {
			let args = [ logger, "view", "test" ];
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.existsSync(target)).to.be.true;
		});

		it("deletes view by given name", () => {
			let args = [ logger, "view", "test" ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(target)).to.be.false;
		});
	});
})();