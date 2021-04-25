const fs = require("fs");
const path = require("path");
global.__main = path.resolve(__dirname + "/..");

// eslint-disable-next-line no-undef
describe("Running all tests", () => {
	const directories = fs.readdirSync(__dirname).filter(d => d != "test.js");
	for (const d of directories)
		require(`./${d}/${d}`);
});