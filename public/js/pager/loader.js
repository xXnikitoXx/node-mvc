
export class Loader {
	constructor(scriptLoadInterval = 50) {
		this.scriptLoadInterval = scriptLoadInterval;
		this.local = window.location.protocol + "//" + window.location.host;
		this.animation = "fade";
	}

	static get Animations() {
		return {
			disappear: [
				{ opacity: "0" },
			],
			fade: [
				{ opacity: "0" },
				{ transition: "all .25s ease-in-out" },
				{ timeout: 250 },
				{ opacity: "1" },
			]
		};
	}

	/**
	 * @param {String} url 
	 */
	isLocal(url) {
		if (url.startsWith("/"))
			return true;
		else return url.startsWith(this.local);
	}

	Load(url, popstate = false) {
		return new Promise((resolve, reject) => {
			if (this.isLocal(url))
				fetch("/import", {
					method: "POST",
					body: JSON.stringify({
						template: url,
						model: model,
					})
				})
				.then(response => response.text())
				.then(data => {
					if (data.startsWith("redirect "))
						return window.location.href = data.slice(9);
					let div = document.createElement("div");
					div.innerHTML = data.trim();
					let main = document.querySelector("body > main");
					main.style.transition = "";
					main.style.opacity = "0";
					[...div.childNodes].forEach(e => main.appendChild(e));
					let elements = [...document.querySelectorAll("body > main > *:not(lock):not(script)")];
					let scripts = [...document.querySelectorAll("*:not(head):not(lock) > script")];
					setTimeout(() => {
						scripts.forEach(script => {
							if (script.src == "")
								this.LoadScript.inline(script.text);
							else
								this.LoadScript.external(script.src);
							script.remove();
						});
						setTimeout(() => {
							if (!popstate)
								history.pushState({}, model.title, url);
							setTimeout(resolve, this.ApplyAnimation([ main ], this.animation));
						}, this.scriptLoadInterval);
					}, 10);
				});
			else
				window.location.href = url;
		});
	}

	ApplyAnimation(elements, type) {
		let timeout = 0;
		for (let keyframe of Loader.Animations[type])
			for (let property in keyframe)
				if (property == "timeout")
					timeout += keyframe[property];
				else
					setTimeout(() => elements.forEach(e => e.style[property] = keyframe[property]), timeout);
		return timeout;
	}

	get LoadScript() {
		return {
			external: (url) => {
				let script = document.createElement("script");
				script.src = url;
				document.querySelector("body > main").appendChild(script);
			},
			inline: (content) => {
				(1, eval)(content);
			}
		}
	}
}