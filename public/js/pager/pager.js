import { Loader } from "./loader.js";
import { Unloader } from "./unloader.js";

window.pager = {
	busy: false,
	unloader: new Unloader("*"),
	scriptLoadTime: 50,
	applyClickEvent: () => {
		let elements = [...document.querySelectorAll("a")]
		.filter(e => e.hasAttribute("href"));
		elements.forEach(e => {
			e.addEventListener("click", (event) => {
				window.pager.visit(e.getAttribute("href"));
				event.preventDefault();
			});
			e.classList.add("linked");
		});
	},
	visit(link, popstate = false) {
		if (window.pager.busy)
			return;
		if (link.includes("javascript:"))
			return eval(link.slice(11));
		window.pager.busy = true;
		this.unloader.Unload("fade")
		.then(() => {
			let loader = new Loader(window.pager.scriptLoadTime);
			loader.Load(link, popstate)
			.then(() => {
				window.pager.unloader = new Unloader("*");
				window.pager.busy = false;
				window.pager.applyClickEvent();
			});
		});
	},
};

window.onpopstate = (event) => {
	window.pager.visit(window.location.pathname, true);
	window.pager.applyClickEvent();
	event.preventDefault();
};

pager.applyClickEvent();