const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	describe("switch tag", () => {
		const test = (message, inputFile, outputFile, log = false) => {
			it(message, async () => {
				let input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				let output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				let renderer = new Renderer({});
				let renderedOutput = await renderer.Render(input, { hostname: "localhost" });
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		}

		test("renders the right value", "switch_1_input.html", "switch_1_output.html");
		test("renders default when the are no right cases", "switch_2_input.html", "switch_2_output.html");
		test("skips the body if no right case or default", "switch_3_input.html", "switch_3_output.html");
	});
})();