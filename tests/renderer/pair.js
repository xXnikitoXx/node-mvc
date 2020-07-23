const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	describe("pair indexes", () => {
		const testIf = (message, inputFile, output, log = false) => {
			it(message, () => {
				let input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				expect(Renderer.Pair("if", input.substring(9))).to.equal(output);
			});
		}

		testIf("checks basic closing tag index", "pair_1_input.html", 5);
		testIf("works with nested tags", "pair_2_input.html", 52);
		testIf("handles multiple tags on the same level", "pair_3_input.html", 6);
	});
})();