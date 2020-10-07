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
				let renderer = new Renderer({
					list: [
						{ name: "George", age: 20, },
						{ name: "Peter", age: 21, },
						{ name: "Anna", age: 12, },
					],
				});
				let renderedOutput = renderer.Render(input, { hostname: "localhost" }).replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		}

		test("renders the body of the tag X times", "for_1_input.html", "for_1_output.html");
		test("works inside nested loops", "for_2_input.html", "for_2_output.html");
		test("works with object properties", "for_3_input.html", "for_3_output.html");
		test("works with spread syntax", "for_4_input.html", "for_4_output.html");
	});
})();