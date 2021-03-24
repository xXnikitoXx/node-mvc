const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("./../../utils/render");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("if tag", () => {
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

		test("evaluates the statement and renders the body of the tag if true", "if_1_input.html", "if_1_output.html");
		test("works inside for tag", "if_2_input.html", "if_2_output.html");
	});
})();