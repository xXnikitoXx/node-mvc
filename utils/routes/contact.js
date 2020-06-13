const { Logger } = require("./../logger");
const { Renderer } = require("./../render");

/**
 * Initializes Terms of Use, Privacy Policy and Contact routes.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
    app.get("/terms", (req, res) => {

    });

    app.get("/privacy", (req, res) => {
        
    });

    app.get("/contact", (req, res) => {

    });
};