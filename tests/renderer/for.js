const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	describe("for tag", () => {
		const test = (message, inputFile, outputFile, log = false) => {
			it(message, () => {
				let input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				let output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				let renderer = new Renderer({});
				let renderedOutput = renderer.Render(input);
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		}

		test("renders the body of the tag X times", "for_1_input.html", "for_1_output.html");
		test("works inside nested loops", "for_2_input.html", "for_2_output.html");
	});
})();