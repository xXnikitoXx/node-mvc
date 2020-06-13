const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const crypto = {
	SHA256: require("sha256"),
	MD5: require("md5"),
};

module.exports = (utils) => new LocalStrategy((username, password, done) => {
	let user = utils.db.Collection("users").findOne({ username: username });
	user.then(user => {
		if (user == null)
			done(null, false);
		else {
			password = crypto.SHA256(user.username + password + user.joinDate).toString();
			if (password == user.password)
				done(null, user);
			else done(null, false);
		}
	}).catch(done);
});