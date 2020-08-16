navbar = new Vue({
	el: "#navbar",
	data() {
		return {
			get user() { return user },
			logo: "/img/icons/favicon.png",
			title: "Website",
			titleLink: "/",
			leftTabs: [
				{ text: "Home", url: "/", active: false },
			],
			rightTabs: [
				{ text: "Login", url: "/login", active: false },
				{ text: "Register", url: "/register", active: false },
			],
		};
	},
});