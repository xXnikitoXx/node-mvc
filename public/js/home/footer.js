footer = new Vue({
	el: "#footer",
	data() {
		return {
			heading: "Footer",
			content: `Some additional content`,
			linksHeading: "Links",
			links: [
				{ url: "#1", text: "Link 1", },
				{ url: "#2", text: "Link 2", },
				{ url: "#3", text: "Link 3", },
			],
			get copyright() { return `© ${new Date().getFullYear()} Copyright text`; },
		};
	},
});