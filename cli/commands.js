module.exports = [
	{
		"cmd": "exit",
		"description": "Exits the CLI",
		"args": [],
		"help": {}
	},
	{
		"cmd": "help",
		"description": "Shows the list with commands",
		"args": [
			{ "arg": "command", "required": false }
		],
		"help": {
			"command": "Show info about specific command's arguments"
		}
	},
	{
		"cmd": "create",
		"description": "Creates elements for the MVC",
		"args": [
			{ "arg": "type", "required": true },
			{ "arg": "name", "required": true },
			{ "arg": "model", "required": false },
			{ "arg": "prop(s)", "required": false }
		],
		"help": {
			"type": "Type of the element you want to create: controller|view|service",
			"name": "The name of the element",
			"model": "Target model the CRUD operations will be written for",
			"prop": "Each property which will have separate update function"
		}
	},
	{
		"cmd": "remove",
		"description": "Removes elements from the MVC",
		"args": [
			{ "arg": "type", "required": false },
			{ "arg": "name", "required": true }
		],
		"help": {
			"type": "Type of the element you want to create: controller|view|service",
			"name": "The name of the element",
			"description": "The description which will be put in the created element as comment"
		}
	},
	{
		"cmd": "start",
		"description": "Starts the application",
		"args": [],
		"help": {}
	}
];