const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();

const { Renderer } = require("./../../utils/render");
let utils = require("./utils");

module.exports = (() => {
	describe("spread syntax", () => {
		const test = (message, inputObject, inputFile, outputFile, log = false) => {
			it(message, async () => {
				let input = fs.readFileSync(`${__dirname}/${inputFile}`).toString();
				let output = fs.readFileSync(`${__dirname}/${outputFile}`).toString();
				let renderer = new Renderer(inputObject, utils);
				let renderedOutput = (await renderer.Render(input, { hostname: "localhost" })).replace(/\r\n/g, "\n").replace(/\n/g, "\r\n");
				if (log)
					console.log(renderedOutput);
				expect(renderedOutput).to.equal(output);
			});
		}

		let test1 = {
			username: "Pesho123",
			age: 20,
			verified: true,
		};

		let test2 = {
			...test1,
			paymentMethods: {
				debitCard: "asd",
				bankTransfer: "dsa",
			}
		}

		test("renders object as js literal with getters", test1, "spreads_1_input.html", "spreads_1_output.html");
		test("works with nested objects", test2, "spreads_2_input.html", "spreads_2_output.html");
	});
})();