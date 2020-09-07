const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("../../utils/render");
let utils = require("./utils");

module.exports = (() => {
	describe("import/export tags", () => {
		const test = (message, inputFile, outputFile, log = false) => {
			it(message, () => {
				let input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				let output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				let renderer = new Renderer({}, utils);
				let renderedOutput = renderer.Render(input);
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		}

		test("imports the default segment from template file", "import_1_input.html", "import_1_output.html");
		test("imports the right segment of template with multiple exports", "import_2_input.html", "import_2_output.html");
	});
})();