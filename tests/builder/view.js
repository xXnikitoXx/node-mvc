const fs = require("fs");
const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

module.exports = (() => {
	describe("view", () => {
		let target = path.join(__dirname, "/../../public/test.html");

		it("creates view by given arguments", () => {
			process.argv = [ null, null, "view", "test" ];
			require("./../../builder/create");
			delete require.cache[require.resolve("./../../builder/create")];
			expect(fs.existsSync(target)).to.be.true;
		});

		it("deletes view by given name", () => {
			process.argv = [ null, null, "view", "test" ];
			require("./../../builder/remove");
			delete require.cache[require.resolve("./../../builder/remove")];
			expect(fs.existsSync(target)).to.be.false;
		});
	});
})();