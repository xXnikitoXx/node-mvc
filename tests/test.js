const fs = require("fs");
const chai = require("chai");
const expect = chai.expect;
const assert = chai.assert;

describe("Running all tests", () => {
	const directories = fs.readdirSync(__dirname).filter(d => d != "test.js");
	for (let d of directories)
		require(`./${d}/${d}`);
});