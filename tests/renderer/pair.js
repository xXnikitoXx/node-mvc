const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("pair indexes", () => {
		const testIf = (message, inputFile, output) => {
			// eslint-disable-next-line no-undef
			it(message, () => {
				const input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				expect(Renderer.Pair("if", input.substring(9))).to.equal(output);
			});
		};

		testIf("checks basic closing tag index", "pair_1_input.html", 5);
		testIf("works with nested tags", "pair_2_input.html", 52);
		testIf("handles multiple tags on the same level", "pair_3_input.html", 6);
	});
})();