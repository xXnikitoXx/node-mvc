const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("switch tag", () => {
		const test = (message, inputFile, outputFile, log = false) => {
			// eslint-disable-next-line no-undef
			it(message, async () => {
				const input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				const output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				const renderer = new Renderer({});
				const renderedOutput = await renderer.Render(input, { hostname: "localhost" });
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		};

		test("renders the right value", "switch_1_input.html", "switch_1_output.html");
		test("renders default when the are no right cases", "switch_2_input.html", "switch_2_output.html");
		test("skips the body if no right case or default", "switch_3_input.html", "switch_3_output.html");
	});
})();