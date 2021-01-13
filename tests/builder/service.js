const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	describe("service", () => {
		it("creates service by given arguments", () => {
			let args = [ logger, "service", "test", "this is a test service" ];
			let result = fs.readFileSync(path.join(__dirname, "/../../cli/builder/templates/service.template.js")).toString();
			result = result
				.replace(/§name/g, "test")
				.replace(/§description/g, "this is a test service");
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.readFileSync(path.join(__dirname, "/../../utils/services/test.js")).toString()).to.equal(result);
		});

		it("deletes service by given name", () => {
			let args = [ logger, "service", "test" ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(path.join(__dirname, "/../../utils/services/test.js"))).to.be.false;
		});
	});
})();