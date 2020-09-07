export class Unloader {
	constructor(selector = null) {
		this.Update(selector);
	}

	static get Animations() {
		return {
			fade: [
				{ transition: "all .25s ease-in-out", },
				{ opacity: "0" },
				{ timeout: 250 },
			]
		};
	}

	Update(selector = null) {
		if (typeof(selector) == "string")
			this.elements = [...document.querySelectorAll(`body > main > ${selector}:not(lock)`)];
		else
			this.elements = selector;
	}

	Unload(animation = Object.keys(Unloader.Animations) || "none") {
		return new Promise((resolve, reject) => {
			let timeout = 0;
			if (animation != "none")
				timeout = this.ApplyAnimation(animation);
			setTimeout(() => {
				this.Remove();
				resolve();
			}, timeout);
		});
	}

	ApplyAnimation(type) {
		let timeout = 0;
		for (let keyframe of Unloader.Animations[type])
			for (let property in keyframe)
				if (property == "timeout")
					timeout += keyframe[property];
				else
					setTimeout(() => this.elements.forEach(e => e.style[property] = keyframe[property]), timeout);
		return timeout;
	}

	Remove() {
		this.elements.forEach(e => e.remove());
	}
}