const message = `Invalid command! Type "help" for the list with commands`;

module.exports = logger => logger.text.danger(message);