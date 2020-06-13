/**
 * Initializes IP check.
 * @function
 * @param {Express.Application} app
 * @param {any} utils
 */
module.exports = (app, utils) => {
    app.use((req, res, next) => {
        req.IP = (req.headers["x-forwarded-for"] || "").split(",").pop().trim() || 
                    req.connection.remoteAddress || 
                    req.socket.remoteAddress || 
                    req.connection.socket.remoteAddress;
        if (req.IP.includes("::ffff:"))
            req.IP = req.IP.substr(7);
        next();
    });
};