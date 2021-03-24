const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;

const { Renderer } = require("./../../utils/render");
const utils = require("./utils");

module.exports = (() => {
	// eslint-disable-next-line no-undef
	describe("spread syntax", () => {
		const test = (message, inputObject, inputFile, outputFile, log = false) => {
			// eslint-disable-next-line no-undef
			it(message, async () => {
				const input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				const output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				const renderer = new Renderer(inputObject, utils);
				const renderedOutput = (await renderer.Render(input, { hostname: "localhost" })).replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		};

		const test1 = {
			username: "Pesho123",
			age: 20,
			verified: true,
		};

		const test2 = {
			...test1,
			paymentMethods: {
				debitCard: "asd",
				bankTransfer: "dsa",
			}
		};

		test("renders object as js literal with getters", test1, "spreads_1_input.html", "spreads_1_output.html");
		test("works with nested objects", test2, "spreads_2_input.html", "spreads_2_output.html");
	});
})();