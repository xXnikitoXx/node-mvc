const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("../../utils/render");
const utils = require("./utils");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("import/export tags", () => {
		const test = (message, inputFile, outputFile, log = false) => {
			// eslint-disable-next-line no-undef
			it(message, async () => {
				const input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				const output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				const renderer = new Renderer({}, utils);
				const renderedOutput = await renderer.Render(input, { hostname: "localhost" });
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		};

		test("imports the default segment from template file", "import_1_input.html", "import_1_output.html");
		test("imports the right segment of template with multiple exports", "import_2_input.html", "import_2_output.html");
		test("works with nested imports", "import_3_input.html", "import_3_output.html");
	});
})();