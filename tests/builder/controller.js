const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

module.exports = (() => {
	describe("controller", () => {
		it("creates controller by given arguments", () => {
			process.argv = [ null, null, "controller", "test", "this is a test controller" ];
			let result = fs.readFileSync(path.join(__dirname, "/../../builder/templates/controller.template.js")).toString();
			result = result
				.replace(/§name/g, "test")
				.replace(/§description/g, "this is a test controller");
			require("./../../builder/create");
			delete require.cache[require.resolve("./../../builder/create")];
			expect(fs.readFileSync(path.join(__dirname, "/../../utils/routes/test.js")).toString()).to.equal(result);
		});

		it("deletes controller by given name", () => {
			process.argv = [ null, null, "controller", "test" ];
			require("./../../builder/remove");
			delete require.cache[require.resolve("./../../builder/remove")];
			expect(fs.existsSync(path.join(__dirname, "/../../utils/routes/test.js"))).to.be.false;
		});
	});
})();