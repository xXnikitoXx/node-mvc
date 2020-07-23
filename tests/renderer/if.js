const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	describe("if tag", () => {
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

		test("evaluates the statement and renders the body of the tag if true", "if_1_input.html", "if_1_output.html");
		test("works inside for tag", "if_2_input.html", "if_2_output.html");
	});
})();