const title = "\tTech Lab MVC - CLI";
const subtitle = `\tType "help" for the list with commands.`;

module.exports = logger => {
	logger.line();
	logger.title(title);
	logger.subtitle(subtitle);
	logger.line();
}