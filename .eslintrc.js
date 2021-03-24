module.exports = {
	root: true,
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 2020
	},
	rules: {
		semi: [ "warn", "always", ],
		"no-var": [ "warn", ],
		"no-eq-null": [ "warn", ],
		"prefer-const": [ "warn", ],
		"no-extra-parens": [ "warn", "all", ],
		"class-methods-use-this": [ "warn", ],
	}
};