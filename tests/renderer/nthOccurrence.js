const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("nth occurrence", () => {
		// eslint-disable-next-line no-undef
		it("returns the right index", () => {
			expect(Renderer.NthOccurrence("to test or not to test to", "to", 1)).to.equal(15);
		});
	});
})();