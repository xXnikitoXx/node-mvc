const fs = require("fs");

/**
 * Injects objects in the database.
 * @class
 */
class Injector {
    /**
     * Initializes database injector.
     * @param {any} utils 
     */
    constructor(utils) {
        this.utils = utils;
    }

    /**
     * 
     * @param {String} pattern 
     * @param {String} file
     * @returns {any} object
     */
    static Parse(pattern, file) {
        if (!fs.existsSync(file))
            return JSON.parse(pattern.replace("$content", `""`));
        file = fs.readFileSync(file);
        return JSON.parse(pattern.replace("$content", file));
    }

    /**
     * Renders JSON pattern from file and inserts it in the given collection.
     * @param {String} collection 
     * @param {String} pattern 
     * @param {String} file 
     * @returns {Promise} Promise
     */
    InsertFile(collection, pattern, file) {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(file)) {
                this.utils.logger.messages.fsExistError(file);
                reject("Unable to insert not existing file.");
                return;
            }
            collection = this.utils.db.Collection(collection);
            collection.insertOne(Injector.Parse(pattern, file))
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = { Injector };