const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	describe("nth occurrence", () => {
		it("returns the right index", () => {
			expect(Renderer.NthOccurrence("to test or not to test to", "to", 1)).to.equal(15);
		});
	});
})();