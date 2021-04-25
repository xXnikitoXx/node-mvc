const path = require("path");
global.__main = path.dirname(require.main.filename);

const { App } = require("./utils/app");
const { Constraint } = require("./utils/database/factories/constraints");
const { Controller } = require("./utils/routes/controller");
const { DBHelper: MongoDBHelper } = require("./utils/database/helpers/mongodb_helper");
const { DependencyManager, ServiceOrganizer } = require("./utils/services/services");
const { ErrorHandler, HandleError } = require("./utils/error");
const { Factory } = require("./utils/database/factories/factory");
const { Injector } = require("./utils/database/injector");
const { Iterator } = require("./utils/iterator");
const { Logger } = require("./utils/logger");
const { Registrar } = require("./utils/permissions/registrar");
const { Renderer } = require("./utils/render");
const { Role } = require("./utils/permissions/role");
const { Server } = require("./utils/server");
const { Validator } = require("./utils/database/validator");

module.exports = {
	App,
	Constraint,
	Controller,
	MongoDBHelper,
	DependencyManager,
	ErrorHandler,
	Factory,
	Injector,
	Iterator,
	Logger,
	Registrar,
	Renderer,
	Role,
	Server,
	ServiceOrganizer,
	Validator,
};