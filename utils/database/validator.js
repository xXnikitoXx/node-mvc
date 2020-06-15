/**
 * Validates data by given model.
 * @class
 */
class Validator {
    /**
     * Initializes validator with model.
     * @param {any} model
     * @param {Boolean} strict
     * Set strict to true to detect objects as invalid when they have additional properties except the stated ones in the model.
     */
    constructor(model, strict = false) {
        this.strict = strict;
        for (let prop in model) {
            let mod = model[prop];
            switch (typeof(mod)) {
                case "string":
                    this[prop] = {
                        type: mod,
                    };
                    break;
                case "object":
                    if (Array.isArray(mod)) {
                        this[prop] = {
                            type: mod[0],
                            min: mod[1],
                            max: mod[2],
                        };
                    } else {
                      this[prop] = mod;  
                    }
                    break;
            }
        }
    }

    Type(prop) {
        switch (typeof(prop)) {
            case "number": return Math.round(prop) == prop ? "integer" : "float";
            case "object": Array.isArray(prop) ? "array" : "object";
            default: return typeof(prop);
        }
    }

    IsValid(object) {
        for (let prop in object) {
            if (this[prop] == undefined)
                if (this.strict) return false;
                else continue;
            const obj = object[prop];
            const mod = this[prop];
            const type = this.Type(obj);
            if (mod.type != undefined)
                if (type != mod.type)
                    return false;
            if (mod.min != undefined)
                if (type == "string" || type == "array")
                    if (mod.min > obj.length)
                        return false;
                    else;
                else if (type == "object")
                    if (mod.min > Object.keys(obj).length)
                        return false;
                    else;
                else if (type == "number" || type == float)
                    if (mod.min > obj)
                        return false;
            if (mod.max != undefined)
                if (type == "string" || type == "array")
                    if (mod.max < obj.length)
                        return false;
                    else;
                else if (type == "object")
                    if (mod.max < Object.keys(obj).length)
                        return false;
                    else;
                else if (type == "number" || type == float)
                    if (mod.max < obj)
                        return false;
        }
        return true;
    }
}

module.exports = { Validator };