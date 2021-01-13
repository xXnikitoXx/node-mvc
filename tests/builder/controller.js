const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const { Logger } = require("./../../utils/logger");
const logger = new Logger(false);

module.exports = (() => {
	describe("controller", () => {
		it("creates controller by given arguments", () => {
			let args = [ logger, "controller", "test", "this is a test controller" ];
			let result = fs.readFileSync(path.join(__dirname, "/../../cli/builder/templates/controller.template.js")).toString();
			result = result
				.replace(/§name/g, "test")
				.replace(/§description/g, "this is a test controller");
			require("./../../cli/builder/create").apply(null, args);
			expect(fs.readFileSync(path.join(__dirname, "/../../utils/routes/test.js")).toString()).to.equal(result);
		});

		it("deletes controller by given name", () => {
			let args = [ logger, "controller", "test" ];
			require("./../../cli/builder/remove").apply(null, args);
			expect(fs.existsSync(path.join(__dirname, "/../../utils/routes/test.js"))).to.be.false;
		});
	});
})();