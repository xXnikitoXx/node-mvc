const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

module.exports = (() => {
	describe("service", () => {
		it("creates service by given arguments", () => {
			process.argv = [ null, null, "service", "test", "this is a test service" ];
			let result = fs.readFileSync(path.join(__dirname, "/../../builder/templates/service.template.js")).toString();
			result = result
				.replace(/§name/g, "test")
				.replace(/§description/g, "this is a test service");
			require("./../../builder/create");
			delete require.cache[require.resolve("./../../builder/create")];
			expect(fs.readFileSync(path.join(__dirname, "/../../utils/services/test.js")).toString()).to.equal(result);
		});

		it("deletes service by given name", () => {
			process.argv = [ null, null, "service", "test" ];
			require("./../../builder/remove");
			delete require.cache[require.resolve("./../../builder/remove")];
			expect(fs.existsSync(path.join(__dirname, "/../../utils/services/test.js"))).to.be.false;
		});
	});
})();