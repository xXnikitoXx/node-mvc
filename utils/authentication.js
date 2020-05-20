const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const crypto = {
	SHA256: require("sha256"),
	MD5: require("md5")
};

let authentication = new LocalStrategy((username, password, done) => {
	
});